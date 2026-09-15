<?php

declare(strict_types=1);

namespace Tests\Unit\Service;

use App\Exceptions\Domain\ValidationException;
use App\Models\Liste;
use App\Models\ListItem;
use App\Models\Product;
use App\Service\ItemService;
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

    private function makeList(): Liste
    {
        $user = $this->createUserWithHousehold();

        return Liste::factory()->create([
            'household_id' => $user->household()->id,
            'created_by' => $user->id,
            'visibility' => 'shared',
        ]);
    }

    public function test_create_item_saves_to_database(): void
    {
        $list = $this->makeList();

        $item = $this->service->createItem(['name' => 'Milk', 'quantity' => 2], $list);

        $this->assertInstanceOf(ListItem::class, $item);
        $this->assertDatabaseHas('list_items', ['name' => 'Milk', 'quantity' => 2, 'list_id' => $list->id]);
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

    public function test_create_item_ignores_product_from_another_household(): void
    {
        $list = $this->makeList();
        $otherHouseholdId = $this->createUserWithHousehold()->household()->id;
        $foreignProduct = Product::create(['household_id' => $otherHouseholdId, 'name' => 'Foreign Butter']);

        $item = $this->service->createItem(['name' => 'Butter', 'quantity' => 1, 'product_id' => $foreignProduct->id], $list);

        $this->assertNull($item->product_id);
    }

    public function test_update_item_ignores_product_from_another_household(): void
    {
        $user = $this->createUserWithHousehold();
        $list = Liste::factory()->create(['household_id' => $user->household()->id, 'created_by' => $user->id]);
        $item = $this->service->createItem(['name' => 'Butter', 'quantity' => 1], $list);
        $otherHouseholdId = $this->createUserWithHousehold()->household()->id;
        $foreignProduct = Product::create(['household_id' => $otherHouseholdId, 'name' => 'Foreign Butter']);

        $this->service->updateItem($list->id, $item->id, ['product_id' => $foreignProduct->id], $user);

        $this->assertDatabaseHas('list_items', ['id' => $item->id, 'product_id' => null]);
    }

    public function test_update_item_accepts_product_from_same_household(): void
    {
        $user = $this->createUserWithHousehold();
        $list = Liste::factory()->create(['household_id' => $user->household()->id, 'created_by' => $user->id]);
        $item = $this->service->createItem(['name' => 'Butter', 'quantity' => 1], $list);
        $ownProduct = Product::create(['household_id' => $list->household_id, 'name' => 'Own Butter']);

        $this->service->updateItem($list->id, $item->id, ['product_id' => $ownProduct->id], $user);

        $this->assertDatabaseHas('list_items', ['id' => $item->id, 'product_id' => $ownProduct->id]);
    }

    public function test_reorder_updates_sort_order(): void
    {
        $user = $this->createUserWithHousehold();
        $list = Liste::factory()->create([
            'household_id' => $user->household()->id,
            'created_by' => $user->id,
        ]);

        $a = ListItem::factory()->create(['list_id' => $list->id, 'sort_order' => 0]);
        $b = ListItem::factory()->create(['list_id' => $list->id, 'sort_order' => 1]);
        $c = ListItem::factory()->create(['list_id' => $list->id, 'sort_order' => 2]);

        // Reorder: put C first, then A, then B
        $this->service->reorderItems($list->id, [$c->id, $a->id, $b->id], $user);

        $this->assertDatabaseHas('list_items', ['id' => $c->id, 'sort_order' => 0]);
        $this->assertDatabaseHas('list_items', ['id' => $a->id, 'sort_order' => 1]);
        $this->assertDatabaseHas('list_items', ['id' => $b->id, 'sort_order' => 2]);
    }
}
