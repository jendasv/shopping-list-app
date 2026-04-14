<?php

declare(strict_types=1);

namespace App\Service;

use App\Enums\ShoppingListVisibility;
use App\Events\ListCreated;
use App\Events\ListDeleted;
use App\Events\ListUpdated;
use App\Exceptions\Domain\ResourceNotFoundException;
use App\Exceptions\Domain\ValidationException;
use App\Exceptions\Infrastructure\DatabaseOperationException;
use App\Mapper\ShoppingListMapper;
use App\Models\ShoppingList;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Throwable;

class ShoppingListService
{
    public function __construct(
        private readonly ShoppingListMapper $shoppingListMapper,
    ) {}

    private function itemService(): ItemService
    {
        return app(ItemService::class);
    }

    /**
     * @param  array<string, string>  $params
     * @return array<string, mixed>
     */
    public function getAllLists(User $user, array $params = []): array
    {
        $household = $user->household();
        $search = $params['search'] ?? null;
        $filter = $params['filter'] ?? 'all';
        $sort = $params['sort'] ?? 'custom';
        $page = max(1, (int) ($params['page'] ?? 1));

        $query = ShoppingList::with(['items' => fn ($q) => $q->orderBy('is_completed')->orderBy('sort_order')])
            ->leftJoin('list_user_order', function ($join) use ($user) {
                $join->on('list_user_order.shopping_list_id', '=', 'shopping_list.id')
                    ->where('list_user_order.user_id', '=', $user->id);
            })
            ->select('shopping_list.*', 'list_user_order.sort_order as user_sort_order')
            ->withCount('items');

        if ($household) {
            $query->where('shopping_list.household_id', $household->id)
                ->where(function ($q) use ($user) {
                    $q->where('shopping_list.visibility', ShoppingListVisibility::Shared->value)
                        ->orWhere('shopping_list.created_by', $user->id);
                });
        } else {
            $query->where('shopping_list.created_by', $user->id);
        }

        if ($search) {
            $query->where('shopping_list.name', 'ILIKE', "%{$search}%");
        }

        if ($filter === 'shared') {
            $query->where('shopping_list.visibility', ShoppingListVisibility::Shared->value);
        } elseif ($filter === 'private') {
            $query->where('shopping_list.visibility', ShoppingListVisibility::Private->value);
        }

        match ($sort) {
            'az' => $query->orderBy('shopping_list.name', 'ASC'),
            'za' => $query->orderBy('shopping_list.name', 'DESC'),
            'items-desc' => $query->orderByRaw('items_count DESC'),
            'items-asc' => $query->orderByRaw('items_count ASC'),
            'newest' => $query->orderBy('shopping_list.created_at', 'DESC'),
            'oldest' => $query->orderBy('shopping_list.created_at', 'ASC'),
            default => $query->orderByRaw('list_user_order.sort_order IS NULL, list_user_order.sort_order ASC'),
        };

        $paginated = $query->paginate(10, ['*'], 'page', $page);

        $data = collect($paginated->items())
            ->map(fn ($list) => $this->shoppingListMapper->map($list, listOnly: true, user: $user))
            ->values()
            ->all();

        return [
            'data' => $data,
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'total' => $paginated->total(),
                'per_page' => $paginated->perPage(),
            ],
        ];
    }

    public function findList(int $id, User $user): ShoppingList
    {
        $household = $user->household();

        $query = ShoppingList::with(['items' => fn ($q) => $q->orderBy('is_completed')->orderBy('sort_order')])->where('id', $id);

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
        return $this->shoppingListMapper->map($this->findList($id, $user), user: $user);
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
                    $this->itemService()->createItem($itemData, $list);
                }
            }

            $list->load('items');

            $minOrder = DB::table('list_user_order')->where('user_id', $user->id)->min('sort_order') ?? 1;
            DB::table('list_user_order')->insert([
                'user_id' => $user->id,
                'shopping_list_id' => $list->id,
                'sort_order' => $minOrder - 1,
            ]);
        } catch (Throwable $e) {
            throw new DatabaseOperationException('Failed to create shopping list: '.$e->getMessage());
        }

        $list->user_sort_order = DB::table('list_user_order')
            ->where('user_id', $user->id)
            ->where('shopping_list_id', $list->id)
            ->value('sort_order');

        $mapped = $this->shoppingListMapper->map($list, user: $user);

        if ($list->household_id && $list->visibility === ShoppingListVisibility::Shared->value) {
            broadcast(new ListCreated($list->household_id, array_merge($mapped, ['isOwner' => false])))->toOthers();
        }

        return $mapped;
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

        return $this->shoppingListMapper->map($list, user: $user);
    }

    /**
     * @param  array<int, int>  $orderedIds
     */
    public function reorderLists(array $orderedIds, User $user): void
    {
        foreach ($orderedIds as $position => $id) {
            DB::table('list_user_order')->updateOrInsert(
                ['user_id' => $user->id, 'shopping_list_id' => $id],
                ['sort_order' => $position],
            );
        }
    }

    public function deleteList(int $id, User $user): void
    {
        $list = $this->findList($id, $user);
        $householdId = $list->household_id;
        $isShared = $list->visibility === ShoppingListVisibility::Shared->value;

        try {
            $list->delete();
        } catch (Throwable $e) {
            throw new DatabaseOperationException('Failed to delete shopping list: '.$e->getMessage());
        }

        if ($householdId && $isShared) {
            broadcast(new ListDeleted($householdId, $id))->toOthers();
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
