<?php

declare(strict_types=1);

namespace App\Service;

use App\Events\ItemAdded;
use App\Events\ItemDeleted;
use App\Events\ItemsReordered;
use App\Events\ItemUpdated;
use App\Exceptions\Domain\ResourceNotFoundException;
use App\Exceptions\Domain\ValidationException;
use App\Exceptions\Infrastructure\DatabaseOperationException;
use App\Mapper\ItemMapper;
use App\Mapper\ListMapper;
use App\Models\Liste;
use App\Models\ListItem;
use App\Models\Product;
use App\Models\User;
use Throwable;

class ItemService
{
    public function __construct(
        private readonly ItemMapper $itemMapper,
        private readonly ListMapper $listMapper,
        private readonly ListService $listService,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function getItem(int $listId, int $itemId, User $user): array
    {
        $item = $this->findItem($listId, $itemId, $user);
        $item->loadMissing('unit');

        return $this->itemMapper->map($item);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function createItem(array $data, Liste $list): ListItem
    {
        // Resolve product and auto-fill fields
        $product = null;
        if (isset($data['product_id'])) {
            $product = Product::where('id', $data['product_id'])
                ->where('household_id', $list->household_id)
                ->first();

            // If product doesn't belong to this household, ignore it
            if ($product === null) {
                $data['product_id'] = null;
            }
        }

        if ($product !== null) {
            if (! isset($data['name'])) {
                $data['name'] = $product->name;
            }
            if (! array_key_exists('unit_id', $data) && $product->preferred_unit_id !== null) {
                $data['unit_id'] = $product->preferred_unit_id;
            }
            if (! array_key_exists('quantity', $data) && $product->preferred_quantity !== null) {
                $data['quantity'] = $product->preferred_quantity;
            }
        }

        $this->validateItemData($data);

        try {
            $item = new ListItem;
            $item->name = $data['name'];
            $item->quantity = isset($data['quantity']) ? (float) $data['quantity'] : null;
            $item->is_completed = false;
            $item->list_id = $list->id;
            $item->product_id = $product?->id;
            $item->unit_id = $data['unit_id'] ?? null;
            $item->notes = $data['notes'] ?? null;
            $item->sort_order = ListItem::where('list_id', $list->id)->max('sort_order') + 1;
            $item->save();
        } catch (Throwable $e) {
            throw new DatabaseOperationException('Failed to create item: '.$e->getMessage());
        }

        if ($list->household_id) {
            broadcast(new ItemAdded($list->household_id, $this->itemMapper->map($item)))->toOthers();
        }

        return $item;
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function createItemForList(int $listId, array $data, User $user): array
    {
        $list = $this->listService->findList($listId, $user);
        $this->createItem($data, $list);
        $list->load('items.unit');

        return $this->listMapper->map($list);
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function updateItem(int $listId, int $itemId, array $data, User $user): array
    {
        $item = $this->findItem($listId, $itemId, $user);

        try {
            if (isset($data['name'])) {
                $item->name = $data['name'];
            }
            if (array_key_exists('quantity', $data)) {
                $item->quantity = $data['quantity'] !== null ? (float) $data['quantity'] : null;
            }
            if (array_key_exists('isCompleted', $data)) {
                $item->is_completed = (bool) $data['isCompleted'];
            }
            if (array_key_exists('unit_id', $data)) {
                $item->unit_id = $data['unit_id'];
            }
            if (array_key_exists('notes', $data)) {
                $item->notes = $data['notes'];
            }
            if (array_key_exists('product_id', $data)) {
                $item->product_id = $data['product_id'];
            }
            $item->save();
        } catch (Throwable $e) {
            throw new DatabaseOperationException('Failed to update item: '.$e->getMessage());
        }

        $item->loadMissing('unit');
        $list = $item->list;
        if ($list->household_id) {
            broadcast(new ItemUpdated($list->household_id, $this->itemMapper->map($item)))->toOthers();
        }

        return $this->itemMapper->map($item);
    }

    /**
     * @param  array<int, int>  $orderedIds
     */
    public function reorderItems(int $listId, array $orderedIds, User $user): void
    {
        $list = $this->listService->findList($listId, $user);

        foreach ($orderedIds as $position => $itemId) {
            ListItem::where('id', $itemId)
                ->where('list_id', $listId)
                ->update(['sort_order' => $position]);
        }

        if ($list->household_id) {
            broadcast(new ItemsReordered($list->household_id, $listId, $orderedIds))->toOthers();
        }
    }

    public function deleteItem(int $listId, int $itemId, User $user): void
    {
        $item = $this->findItem($listId, $itemId, $user);

        $list = $item->list;

        try {
            $item->delete();
        } catch (Throwable $e) {
            throw new DatabaseOperationException('Failed to delete item: '.$e->getMessage());
        }

        if ($list->household_id) {
            broadcast(new ItemDeleted($list->household_id, ['id' => $itemId, 'listId' => $listId]))->toOthers();
        }
    }

    private function findItem(int $listId, int $itemId, User $user): ListItem
    {
        // Verify access to the list (respects household + visibility)
        $this->listService->findList($listId, $user);

        $item = ListItem::where('id', $itemId)
            ->where('list_id', $listId)
            ->first();

        if ($item === null) {
            throw new ResourceNotFoundException('Item not found.');
        }

        return $item;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function validateItemData(array $data, ?int $itemId = null): void
    {
        $errors = [];

        if ($itemId === null && (empty($data['name']) || ! is_string($data['name']))) {
            $errors['name'] = 'Item name is required.';
        }

        if (
            isset($data['quantity'])
            && (! is_numeric($data['quantity']) || (float) $data['quantity'] < 0.01)
        ) {
            $errors['quantity'] = 'Quantity must be a positive number.';
        }

        if ($errors !== []) {
            throw new ValidationException('Validation failed.', $errors);
        }
    }
}
