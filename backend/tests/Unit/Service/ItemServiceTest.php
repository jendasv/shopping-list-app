<?php

declare(strict_types=1);

namespace Tests\Unit\Service;

use App\Exceptions\Domain\ValidationException;
use App\Mapper\ItemMapper;
use App\Mapper\ShoppingListMapper;
use App\Models\Item;
use App\Models\ShoppingList;
use App\Service\ItemService;
use App\Service\ShoppingListService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ItemServiceTest extends TestCase
{
    use RefreshDatabase;

    private ItemService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(ItemService::class);
    }

    private function makeList(): ShoppingList
    {
        $user = $this->createUserWithHousehold();
        return ShoppingList::factory()->create([
            'household_id' => $user->household()->id,
            'created_by' => $user->id,
            'visibility' => 'shared',
        ]);
    }

    public function test_create_item_saves_to_database(): void
    {
        $list = $this->makeList();

        $item = $this->service->createItem(['name' => 'Milk', 'quantity' => 2], $list);

        $this->assertInstanceOf(Item::class, $item);
        $this->assertDatabaseHas('item', ['name' => 'Milk', 'quantity' => 2, 'shopping_list_id' => $list->id]);
    }

    public function test_create_item_throws_on_missing_name(): void
    {
        $list = $this->makeList();

        $this->expectException(ValidationException::class);

        $this->service->createItem(['name' => '', 'quantity' => 1], $list);
    }

    public function test_create_item_throws_on_invalid_quantity(): void
    {
        $list = $this->makeList();

        $this->expectException(ValidationException::class);

        $this->service->createItem(['name' => 'Milk', 'quantity' => 0], $list);
    }

    public function test_items_get_sequential_sort_order(): void
    {
        $list = $this->makeList();

        $first = $this->service->createItem(['name' => 'First', 'quantity' => 1], $list);
        $second = $this->service->createItem(['name' => 'Second', 'quantity' => 1], $list);
        $third = $this->service->createItem(['name' => 'Third', 'quantity' => 1], $list);

        $this->assertSame($first->sort_order + 1, $second->sort_order);
        $this->assertSame($second->sort_order + 1, $third->sort_order);
    }

    public function test_reorder_updates_sort_order(): void
    {
        $user = $this->createUserWithHousehold();
        $list = ShoppingList::factory()->create([
            'household_id' => $user->household()->id,
            'created_by' => $user->id,
        ]);

        $a = Item::factory()->create(['shopping_list_id' => $list->id, 'sort_order' => 0]);
        $b = Item::factory()->create(['shopping_list_id' => $list->id, 'sort_order' => 1]);
        $c = Item::factory()->create(['shopping_list_id' => $list->id, 'sort_order' => 2]);

        // Reorder: put C first, then A, then B
        $this->service->reorderItems($list->id, [$c->id, $a->id, $b->id], $user);

        $this->assertDatabaseHas('item', ['id' => $c->id, 'sort_order' => 0]);
        $this->assertDatabaseHas('item', ['id' => $a->id, 'sort_order' => 1]);
        $this->assertDatabaseHas('item', ['id' => $b->id, 'sort_order' => 2]);
    }
}
