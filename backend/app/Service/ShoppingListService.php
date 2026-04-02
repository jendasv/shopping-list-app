<?php

declare(strict_types=1);

namespace App\Service;

use App\Enums\ShoppingListVisibility;
use App\Events\ListUpdated;
use App\Exceptions\Domain\ResourceNotFoundException;
use App\Exceptions\Domain\ValidationException;
use App\Exceptions\Infrastructure\DatabaseOperationException;
use App\Mapper\ShoppingListMapper;
use App\Models\ShoppingList;
use App\Models\User;
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
    public function getAllLists(User $user): array
    {
        $household = $user->household();

        $query = ShoppingList::with('items');

        if ($household) {
            $query->where('household_id', $household->id)
                ->where(function ($q) use ($user) {
                    $q->where('visibility', ShoppingListVisibility::Shared->value)
                        ->orWhere('created_by', $user->id);
                });
        } else {
            $query->where('created_by', $user->id);
        }

        return $query->get()
            ->map(fn ($list) => $this->shoppingListMapper->map($list, listOnly: true))
            ->values()
            ->all();
    }

    public function findList(int $id, User $user): ShoppingList
    {
        $household = $user->household();

        $query = ShoppingList::with('items')->where('id', $id);

        if ($household) {
            $query->where('household_id', $household->id)
                ->where(function ($q) use ($user) {
                    $q->where('visibility', ShoppingListVisibility::Shared->value)
                        ->orWhere('created_by', $user->id);
                });
        } else {
            $query->where('created_by', $user->id);
        }

        $list = $query->first();

        if ($list === null) {
            throw new ResourceNotFoundException('Shopping list not found.');
        }

        return $list;
    }

    /**
     * @return array<string, mixed>
     */
    public function getList(int $id, User $user): array
    {
        return $this->shoppingListMapper->map($this->findList($id, $user));
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function createList(array $data, User $user): array
    {
        $this->validateListData($data);

        $household = $user->household();

        try {
            $list = ShoppingList::create([
                'name' => $data['name'],
                'household_id' => $household?->id,
                'created_by' => $user->id,
                'visibility' => $data['visibility'] ?? ShoppingListVisibility::Private->value,
            ]);

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
    public function updateList(int $id, array $data, User $user): array
    {
        $list = $this->findList($id, $user);

        try {
            $list->name = $data['name'];
            if (isset($data['visibility'])) {
                $list->visibility = $data['visibility'];
            }
            $list->save();
        } catch (Throwable $e) {
            throw new DatabaseOperationException('Failed to update shopping list: '.$e->getMessage());
        }

        if ($list->household_id) {
            broadcast(new ListUpdated($list->household_id, $this->shoppingListMapper->map($list, listOnly: true)))->toOthers();
        }

        return $this->shoppingListMapper->map($list);
    }

    public function deleteList(int $id, User $user): void
    {
        $list = $this->findList($id, $user);

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
