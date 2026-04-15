<?php

declare(strict_types=1);

namespace App\Mapper;

use App\Models\Liste;
use App\Models\User;

class ListMapper
{
    public function __construct(private readonly ItemMapper $itemMapper) {}

    /**
     * @return array<string, mixed>
     */
    public function map(Liste $list, bool $listOnly = false, ?User $user = null): array
    {
        $data = [
            'id' => $list->id,
            'name' => $list->name,
            'listType' => $list->list_type,
            'status' => $list->status,
            'visibility' => $list->visibility,
            'isOwner' => $user !== null ? (int) $list->created_by === $user->id : null,
            'sortOrder' => isset($list->user_sort_order) ? (int) $list->user_sort_order : null,
            'itemsCount' => isset($list->items_count) ? (int) $list->items_count : null,
            'completedCount' => $list->relationLoaded('items') ? $list->items->where('is_completed', true)->count() : null,
            'createdAt' => $list->created_at?->format('Y-m-d H:i:s'),
            'updatedAt' => $list->updated_at?->format('Y-m-d H:i:s'),
        ];

        if (! $listOnly) {
            $data['items'] = $list->items
                ->map(fn ($item) => $this->itemMapper->map($item))
                ->values()
                ->all();
        }

        return $data;
    }
}
