<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\HouseholdRole;
use App\Models\Household;
use App\Models\User;

class HouseholdPolicy
{
    /**
     * Only the household owner can rename it.
     */
    public function update(User $user, Household $household): bool
    {
        return $this->isOwner($user, $household);
    }

    /**
     * Only the household owner can invite new members.
     */
    public function invite(User $user, Household $household): bool
    {
        return $this->isOwner($user, $household);
    }

    /**
     * Only non-owner members can leave. Owner cannot leave their own household.
     */
    public function leave(User $user, Household $household): bool
    {
        return $this->isMember($user, $household) && ! $this->isOwner($user, $household);
    }

    /**
     * Owner can remove any member from their household (but not themselves).
     */
    public function removeMember(User $user, Household $household): bool
    {
        return $this->isOwner($user, $household);
    }

    private function isOwner(User $user, Household $household): bool
    {
        return $household->members()
            ->where('users.id', $user->id)
            ->wherePivot('role', HouseholdRole::Owner->value)
            ->exists();
    }

    private function isMember(User $user, Household $household): bool
    {
        return $household->members()
            ->where('users.id', $user->id)
            ->exists();
    }
}
