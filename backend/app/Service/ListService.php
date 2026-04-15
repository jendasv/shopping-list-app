<?php

declare(strict_types=1);

namespace App\Service;

use App\Enums\ListVisibility;
use App\Events\ListCreated;
use App\Events\ListDeleted;
use App\Events\ListUpdated;
use App\Exceptions\Domain\ResourceNotFoundException;
use App\Exceptions\Domain\ValidationException;
use App\Exceptions\Infrastructure\DatabaseOperationException;
use App\Mapper\ListMapper;
use App\Models\Liste;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Throwable;

class ListService
{
    public function __construct(
        private readonly ListMapper $listMapper,
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

        $query = Liste::with(['items' => fn ($q) => $q->orderBy('is_completed')->orderBy('sort_order')])
            ->leftJoin('list_user_order', function ($join) use ($user) {
                $join->on('list_user_order.list_id', '=', 'lists.id')
                    ->where('list_user_order.user_id', '=', $user->id);
            })
            ->select('lists.*', 'list_user_order.sort_order as user_sort_order')
            ->withCount('items');

        if ($household) {
            $query->where('lists.household_id', $household->id)
                ->where(function ($q) use ($user) {
                    $q->where('lists.visibility', ListVisibility::Shared->value)
                        ->orWhere('lists.created_by', $user->id);
                });
        } else {
            $query->where('lists.created_by', $user->id);
        }

        if ($search) {
            $query->where('lists.name', 'ILIKE', "%{$search}%");
        }

        if ($filter === 'shared') {
            $query->where('lists.visibility', ListVisibility::Shared->value);
        } elseif ($filter === 'private') {
            $query->where('lists.visibility', ListVisibility::Private->value);
        }

        match ($sort) {
            'az' => $query->orderBy('lists.name', 'ASC'),
            'za' => $query->orderBy('lists.name', 'DESC'),
            'items-desc' => $query->orderByRaw('items_count DESC'),
            'items-asc' => $query->orderByRaw('items_count ASC'),
            'newest' => $query->orderBy('lists.created_at', 'DESC'),
            'oldest' => $query->orderBy('lists.created_at', 'ASC'),
            default => $query->orderByRaw('list_user_order.sort_order IS NULL, list_user_order.sort_order ASC'),
        };

        $paginated = $query->paginate(10, ['*'], 'page', $page);

        $data = collect($paginated->items())
            ->map(fn ($list) => $this->listMapper->map($list, listOnly: true, user: $user))
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

    public function findList(int $id, User $user): Liste
    {
        $household = $user->household();

        $query = Liste::with(['items' => fn ($q) => $q->orderBy('is_completed')->orderBy('sort_order')])->where('id', $id);

        if ($household) {
            $query->where('household_id', $household->id)
                ->where(function ($q) use ($user) {
                    $q->where('visibility', ListVisibility::Shared->value)
                        ->orWhere('created_by', $user->id);
                });
        } else {
            $query->where('created_by', $user->id);
        }

        $list = $query->first();

        if ($list === null) {
            throw new ResourceNotFoundException('List not found.');
        }

        return $list;
    }

    /**
     * @return array<string, mixed>
     */
    public function getList(int $id, User $user): array
    {
        return $this->listMapper->map($this->findList($id, $user), user: $user);
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
            $list = Liste::create([
                'name' => $data['name'],
                'list_type' => $data['list_type'] ?? 'shopping',
                'household_id' => $household?->id,
                'created_by' => $user->id,
                'visibility' => $data['visibility'] ?? ListVisibility::Private->value,
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
                'list_id' => $list->id,
                'sort_order' => $minOrder - 1,
            ]);
        } catch (Throwable $e) {
            throw new DatabaseOperationException('Failed to create list: '.$e->getMessage());
        }

        $list->user_sort_order = DB::table('list_user_order')
            ->where('user_id', $user->id)
            ->where('list_id', $list->id)
            ->value('sort_order');

        $mapped = $this->listMapper->map($list, user: $user);

        if ($list->household_id && $list->visibility === ListVisibility::Shared->value) {
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
            throw new DatabaseOperationException('Failed to update list: '.$e->getMessage());
        }

        if ($list->household_id) {
            broadcast(new ListUpdated($list->household_id, $this->listMapper->map($list, listOnly: true)))->toOthers();
        }

        return $this->listMapper->map($list, user: $user);
    }

    /**
     * @param  array<int, int>  $orderedIds
     */
    public function reorderLists(array $orderedIds, User $user): void
    {
        foreach ($orderedIds as $position => $id) {
            DB::table('list_user_order')->updateOrInsert(
                ['user_id' => $user->id, 'list_id' => $id],
                ['sort_order' => $position],
            );
        }
    }

    public function deleteList(int $id, User $user): void
    {
        $list = $this->findList($id, $user);
        $householdId = $list->household_id;
        $isShared = $list->visibility === ListVisibility::Shared->value;

        try {
            $list->delete();
        } catch (Throwable $e) {
            throw new DatabaseOperationException('Failed to delete list: '.$e->getMessage());
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
            $errors['name'] = 'List name is required.';
        }

        if ($errors !== []) {
            throw new ValidationException('Validation failed.', $errors);
        }
    }
}
