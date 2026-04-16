<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Enums\HouseholdRole;
use App\Enums\ListVisibility;
use App\Http\Controllers\Controller;
use App\Mapper\HouseholdMapper;
use App\Models\Household;
use App\Models\Liste;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HouseholdController extends Controller
{
    public function __construct(private readonly HouseholdMapper $householdMapper) {}

    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $households = $user->households()->with('members')->get();

        $own = $households->first(fn ($h) => $h->pivot->role === HouseholdRole::Owner->value); // @phpstan-ignore-line
        $joined = $households->filter(fn ($h) => $h->pivot->role !== HouseholdRole::Owner->value)->values(); // @phpstan-ignore-line

        if (! $own) {
            return response()->json(['error' => 'No household found.'], 404);
        }

        return response()->json([
            'ownHousehold' => $this->householdMapper->map($own),
            'joinedHouseholds' => $joined->map(fn ($h) => $this->householdMapper->map($h))->values(),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $request->validate(['name' => ['required', 'string', 'max:255']]);

        $user = $request->user();
        $household = $user->households()->wherePivot('role', HouseholdRole::Owner->value)->first();

        if (! $household) {
            return response()->json(['error' => 'No household found.'], 404);
        }

        $this->authorize('update', $household);

        $household->update(['name' => $request->name]);

        return response()->json([
            'household' => ['id' => $household->id, 'name' => $household->name],
        ]);
    }

    public function leave(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $household = Household::find($id);

        if (! $household || ! $user->households()->where('households.id', $id)->exists()) {
            return response()->json(['error' => 'Household not found.'], 404);
        }

        $this->authorize('leave', $household);

        $ownHousehold = $user->households()->wherePivot('role', HouseholdRole::Owner->value)->first();

        if ($ownHousehold) {
            Liste::where('household_id', $household->id)
                ->where('created_by', $user->id)
                ->where('visibility', ListVisibility::Private->value)
                ->update(['household_id' => $ownHousehold->id]);

            $this->copyProductsToHousehold($household->id, $user->id, $ownHousehold->id);

            $ownHousehold->update(['is_active' => true]);
        }

        $household->members()->detach($user->id);

        return response()->json(['message' => 'Left household successfully.']);
    }

    public function removeMember(Request $request, int $userId): JsonResponse
    {
        $owner = $request->user();
        $household = $owner->households()->wherePivot('role', HouseholdRole::Owner->value)->first();

        if (! $household) {
            return response()->json(['error' => 'No household found.'], 404);
        }

        $this->authorize('removeMember', $household);

        $member = User::find($userId);

        if (! $member || ! $household->members()->where('users.id', $userId)->wherePivot('role', HouseholdRole::Member->value)->exists()) {
            return response()->json(['error' => 'Member not found in your household.'], 404);
        }

        // Move member's private lists back to their own household
        $memberOwnHousehold = $member->households()->wherePivot('role', HouseholdRole::Owner->value)->first();
        if ($memberOwnHousehold) {
            Liste::where('household_id', $household->id)
                ->where('created_by', $member->id)
                ->where('visibility', ListVisibility::Private->value)
                ->update(['household_id' => $memberOwnHousehold->id]);

            $this->copyProductsToHousehold($household->id, $member->id, $memberOwnHousehold->id);

            $memberOwnHousehold->update(['is_active' => true]);
        }

        $household->members()->detach($userId);

        return response()->json(['message' => 'Member removed from household.']);
    }

    /**
     * Copy products created by a user in one household to another household.
     * Originals remain — the leaving user takes copies with them.
     */
    private function copyProductsToHousehold(int $fromHouseholdId, int $userId, int $toHouseholdId): void
    {
        Product::where('household_id', $fromHouseholdId)
            ->where('created_by', $userId)
            ->get()
            ->each(function (Product $product) use ($toHouseholdId, $userId): void {
                Product::create([
                    'household_id' => $toHouseholdId,
                    'created_by' => $userId,
                    'global_product_id' => $product->global_product_id,
                    'category_id' => null, // category may not exist in target household
                    'preferred_unit_id' => $product->preferred_unit_id,
                    'name' => $product->name,
                    'barcode' => $product->barcode,
                    'preferred_quantity' => $product->preferred_quantity,
                    'notes' => $product->notes,
                ]);
            });
    }
}
