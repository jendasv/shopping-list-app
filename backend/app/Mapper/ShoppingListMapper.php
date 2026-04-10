<?php

declare(strict_types=1);

namespace App\Mapper;

use App\Models\ShoppingList;
use App\Models\User;

class ShoppingListMapper
{
    public function __construct(private readonly ItemMapper $itemMapper) {}

    /**
     * @return array<string, mixed>
     */
    public function map(ShoppingList $shoppingList, bool $listOnly = false, ?User $user = null): array
    {
        $data = [
            'id' => $shoppingList->id,
            'name' => $shoppingList->name,
            'visibility' => $shoppingList->visibility,
            'isOwner' => $user !== null ? (int) $shoppingList->created_by === $user->id : null,
            'sortOrder' => isset($shoppingList->user_sort_order) ? (int) $shoppingList->user_sort_order : null,
            'itemsCount' => isset($shoppingList->items_count) ? (int) $shoppingList->items_count : null,
            'completedCount' => $shoppingList->relationLoaded('items') ? $shoppingList->items->where('is_completed', true)->count() : null,
            'createdAt' => $shoppingList->created_at?->format('Y-m-d H:i:s'),
            'updatedAt' => $shoppingList->updated_at?->format('Y-m-d H:i:s'),
        ];

        if (! $listOnly) {
            $data['items'] = $shoppingList->items
                ->map(fn ($item) => $this->itemMapper->map($item))
                ->values()
                ->all();
        }

        return $data;
    }
}
