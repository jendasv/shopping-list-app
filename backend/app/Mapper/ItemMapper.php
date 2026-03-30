<?php

declare(strict_types=1);

namespace App\Mapper;

use App\Models\Item;

class ItemMapper
{
    /**
     * @return array<string, mixed>
     */
    public function map(Item $item): array
    {
        return [
            'id' => $item->id,
            'name' => $item->name,
            'quantity' => $item->quantity,
            'isCompleted' => (bool) $item->is_completed,
            'shoppingListId' => $item->shopping_list_id,
            'createdAt' => $item->created_at?->format('Y-m-d H:i:s'),
            'updatedAt' => $item->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
