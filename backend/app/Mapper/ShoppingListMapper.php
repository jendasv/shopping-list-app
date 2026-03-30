<?php

declare(strict_types=1);

namespace App\Mapper;

use App\Models\ShoppingList;

class ShoppingListMapper
{
    public function __construct(private readonly ItemMapper $itemMapper) {}

    /**
     * @return array<string, mixed>
     */
    public function map(ShoppingList $shoppingList, bool $listOnly = false): array
    {
        $data = [
            'id' => $shoppingList->id,
            'name' => $shoppingList->name,
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
