<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\HouseholdRole;
use App\Models\Invitation;
use App\Models\User;

class InvitationPolicy
{
    /**
     * Only household owners can send invitations.
     */
    public function send(User $user): bool
    {
        $household = $user->household();
        if (! $household) {
            return false;
        }

        return $household->members()
            ->where('users.id', $user->id)
            ->wherePivot('role', HouseholdRole::Owner->value)
            ->exists();
    }

    /**
     * Only the invited person can accept.
     */
    public function accept(User $user, Invitation $invitation): bool
    {
        return $user->email === $invitation->email && $invitation->isPending();
    }

    /**
     * Only the invited person can decline.
     */
    public function decline(User $user, Invitation $invitation): bool
    {
        return $user->email === $invitation->email && $invitation->isPending();
    }
}
