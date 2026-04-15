<?php

declare(strict_types=1);

namespace App\Mapper;

use App\Models\Liste;
use App\Models\User;

/**
 * @deprecated Use ListMapper instead.
 */
class ShoppingListMapper extends ListMapper
{
    /**
     * @return array<string, mixed>
     */
    public function map(Liste $list, bool $listOnly = false, ?User $user = null): array
    {
        return parent::map($list, $listOnly, $user);
    }
}
