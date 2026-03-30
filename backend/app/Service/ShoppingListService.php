<?php

declare(strict_types=1);

namespace App\Service;

use App\Exceptions\Domain\ResourceNotFoundException;
use App\Exceptions\Domain\ValidationException;
use App\Exceptions\Infrastructure\DatabaseOperationException;
use App\Mapper\ShoppingListMapper;
use App\Models\ShoppingList;
use Throwable;

class ShoppingListService
{
    public function __construct(
        private readonly ShoppingListMapper $shoppingListMapper,
        private readonly ItemService $itemService,
    ) {}

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getAllLists(): array
    {
        return ShoppingList::with('items')
            ->get()
            ->map(fn ($list) => $this->shoppingListMapper->map($list, listOnly: true))
            ->values()
            ->all();
    }

    public function findList(int $id): ShoppingList
    {
        $list = ShoppingList::with('items')->find($id);

        if ($list === null) {
            throw new ResourceNotFoundException('Shopping list not found.');
        }

        return $list;
    }

    /**
     * @return array<string, mixed>
     */
    public function getList(int $id): array
    {
        return $this->shoppingListMapper->map($this->findList($id));
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function createList(array $data): array
    {
        $this->validateListData($data);

        try {
            $list = ShoppingList::create(['name' => $data['name']]);

            if (! empty($data['items']) && is_array($data['items'])) {
                foreach ($data['items'] as $itemData) {
                    $this->itemService->createItem($itemData, $list);
                }
            }

            $list->load('items');
        } catch (Throwable $e) {
            throw new DatabaseOperationException('Failed to create shopping list: '.$e->getMessage());
        }

        return $this->shoppingListMapper->map($list);
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function updateList(int $id, array $data): array
    {
        $list = $this->findList($id);

        try {
            $list->name = $data['name'];
            $list->save();
        } catch (Throwable $e) {
            throw new DatabaseOperationException('Failed to update shopping list: '.$e->getMessage());
        }

        return $this->shoppingListMapper->map($list);
    }

    public function deleteList(int $id): void
    {
        $list = $this->findList($id);

        try {
            $list->delete();
        } catch (Throwable $e) {
            throw new DatabaseOperationException('Failed to delete shopping list: '.$e->getMessage());
        }
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function validateListData(array $data): void
    {
        $errors = [];

        if (empty($data['name']) || ! is_string($data['name'])) {
            $errors['name'] = 'Shopping list name is required.';
        }

        if ($errors !== []) {
            throw new ValidationException('Validation failed.', $errors);
        }
    }
}
