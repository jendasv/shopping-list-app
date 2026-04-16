<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Enums\HouseholdRole;
use App\Enums\InvitationStatus;
use App\Http\Controllers\Controller;
use App\Mail\HouseholdInvitation;
use App\Models\Invitation;
use App\Models\Liste;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class InvitationController extends Controller
{
    public function send(Request $request): JsonResponse
    {
        $request->validate(['email' => ['required', 'string', 'email']]);

        $this->authorize('send', Invitation::class);

        $user = $request->user();
        $household = $user->households()->wherePivot('role', HouseholdRole::Owner->value)->first();

        $invitee = User::where('email', $request->email)->first();
        if (! $invitee) {
            return response()->json(['error' => 'No account found with this email address.'], 422);
        }

        if ($invitee->id === $user->id) {
            return response()->json(['error' => 'You cannot invite yourself.'], 422);
        }

        $alreadyMember = $household->members()->where('users.id', $invitee->id)->exists();
        if ($alreadyMember) {
            return response()->json(['error' => 'User is already a member of this household.'], 422);
        }

        Invitation::where('household_id', $household->id)
            ->where('email', $request->email)
            ->where('status', InvitationStatus::Pending->value)
            ->update(['status' => InvitationStatus::Expired->value]);

        $invitation = Invitation::create([
            'household_id' => $household->id,
            'invited_by' => $user->id,
            'email' => $request->email,
            'token' => Str::random(64),
            'status' => InvitationStatus::Pending->value,
            'expires_at' => now()->addDays(7),
        ]);

        $invitation->load(['household', 'invitedBy']);
        Mail::to($invitee)->send(new HouseholdInvitation($invitation));

        return response()->json([
            'message' => 'Invitation sent.',
            'invitation' => [
                'id' => $invitation->id,
                'email' => $invitation->email,
                'expiresAt' => $invitation->expires_at,
            ],
        ], 201);
    }

    public function accept(Request $request, string $token): JsonResponse
    {
        $invitation = Invitation::where('token', $token)->first();

        if (! $invitation || ! $invitation->isPending()) {
            return response()->json(['error' => 'Invalid or expired invitation.'], 404);
        }

        $this->authorize('accept', $invitation);

        $user = $request->user();
        $targetHousehold = $invitation->household;
        $ownHousehold = $user->households()->wherePivot('role', HouseholdRole::Owner->value)->first();

        if ($ownHousehold) {
            Liste::where('household_id', $ownHousehold->id)
                ->update(['household_id' => $targetHousehold->id]);

            $ownHousehold->update(['is_active' => false]);
        }

        if (! $targetHousehold->members()->wherePivot('user_id', $user->id)->exists()) {
            $targetHousehold->members()->attach($user->id, ['role' => HouseholdRole::Member->value]);
        }

        $invitation->update(['status' => InvitationStatus::Accepted->value]);

        return response()->json(['message' => 'Invitation accepted.']);
    }

    public function decline(Request $request, string $token): JsonResponse
    {
        $invitation = Invitation::where('token', $token)->first();

        if (! $invitation || ! $invitation->isPending()) {
            return response()->json(['error' => 'Invalid or expired invitation.'], 404);
        }

        $this->authorize('decline', $invitation);

        $invitation->update(['status' => InvitationStatus::Declined->value]);

        return response()->json(['message' => 'Invitation declined.']);
    }
}
