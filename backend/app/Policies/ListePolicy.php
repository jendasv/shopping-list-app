<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\ListVisibility;
use App\Models\Liste;
use App\Models\User;

class ListePolicy
{
    /**
     * Viewing the index is always allowed — the service filters results by household/visibility.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * View a specific list.
     * Private list → only creator. Shared list → any household member.
     */
    public function view(User $user, Liste $list): bool
    {
        if ($list->visibility === ListVisibility::Private->value) {
            return (int) $list->created_by === $user->id;
        }

        return $user->household()?->id === $list->household_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Only the creator can rename or change visibility.
     */
    public function update(User $user, Liste $list): bool
    {
        return (int) $list->created_by === $user->id;
    }

    /**
     * Only the creator can delete their list.
     */
    public function delete(User $user, Liste $list): bool
    {
        return (int) $list->created_by === $user->id;
    }

    /**
     * Items: same rules as view (household member for shared, creator for private).
     */
    public function manageItems(User $user, Liste $list): bool
    {
        return $this->view($user, $list);
    }
}
