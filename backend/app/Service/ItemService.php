<?php

declare(strict_types=1);

namespace App\Service;

use App\Events\ItemAdded;
use App\Events\ItemDeleted;
use App\Events\ItemUpdated;
use App\Exceptions\Domain\ResourceNotFoundException;
use App\Exceptions\Domain\ValidationException;
use App\Exceptions\Infrastructure\DatabaseOperationException;
use App\Mapper\ItemMapper;
use App\Mapper\ShoppingListMapper;
use App\Models\Item;
use App\Models\ShoppingList;
use App\Models\User;
use Throwable;

class ItemService
{
    public function __construct(
        private readonly ItemMapper $itemMapper,
        private readonly ShoppingListMapper $shoppingListMapper,
        private readonly ShoppingListService $shoppingListService,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function getItem(int $listId, int $itemId, User $user): array
    {
        $item = $this->findItem($listId, $itemId, $user);

        return $this->itemMapper->map($item);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function createItem(array $data, ShoppingList $list): Item
    {
        $this->validateItemData($data);

        try {
            $item = new Item;
            $item->name = $data['name'];
            $item->quantity = (int) $data['quantity'];
            $item->is_completed = false;
            $item->shopping_list_id = $list->id;
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
        $list = $this->shoppingListService->findList($listId, $user);
        $this->createItem($data, $list);
        $list->load('items');

        return $this->shoppingListMapper->map($list);
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function updateItem(int $listId, int $itemId, array $data, User $user): array
    {
        $item = $this->findItem($listId, $itemId, $user);

        $this->validateItemData($data, $itemId);

        try {
            $item->name = $data['name'] ?? $item->name;
            $item->quantity = isset($data['quantity']) ? (int) $data['quantity'] : $item->quantity;
            $item->is_completed = isset($data['isCompleted']) ? (bool) $data['isCompleted'] : $item->is_completed;
            $item->save();
        } catch (Throwable $e) {
            throw new DatabaseOperationException('Failed to update item: '.$e->getMessage());
        }

        $list = $item->shoppingList;
        if ($list->household_id) {
            broadcast(new ItemUpdated($list->household_id, $this->itemMapper->map($item)))->toOthers();
        }

        return $this->itemMapper->map($item);
    }

    public function deleteItem(int $listId, int $itemId, User $user): void
    {
        $item = $this->findItem($listId, $itemId, $user);

        $list = $item->shoppingList;

        try {
            $item->delete();
        } catch (Throwable $e) {
            throw new DatabaseOperationException('Failed to delete item: '.$e->getMessage());
        }

        if ($list->household_id) {
            broadcast(new ItemDeleted($list->household_id, ['id' => $itemId, 'listId' => $listId]))->toOthers();
        }
    }

    private function findItem(int $listId, int $itemId, User $user): Item
    {
        // Ověř přístup k listu přes ShoppingListService (respektuje household + visibility)
        $this->shoppingListService->findList($listId, $user);

        $item = Item::where('id', $itemId)
            ->where('shopping_list_id', $listId)
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

        if ($itemId === null && (! isset($data['quantity']) || ! is_numeric($data['quantity']) || (int) $data['quantity'] < 1)) {
            $errors['quantity'] = 'Quantity must be a positive number.';
        }

        if ($errors !== []) {
            throw new ValidationException('Validation failed.', $errors);
        }
    }
}
