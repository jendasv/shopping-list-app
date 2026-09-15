<?php

declare(strict_types=1);

namespace Tests\Unit\Service;

use App\Exceptions\Infrastructure\DatabaseOperationException;
use App\Models\Liste;
use App\Service\ListService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ListServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_list_rolls_back_when_an_item_fails(): void
    {
        $user = $this->createUserWithHousehold();
        $service = app(ListService::class);

        try {
            $service->createList([
                'name' => 'Weekly Shopping',
                'items' => [
                    ['name' => 'Milk', 'quantity' => 1],
                    ['name' => '', 'quantity' => 1], // invalid — fails mid-loop
                ],
            ], $user);
            $this->fail('Expected DatabaseOperationException was not thrown.');
        } catch (DatabaseOperationException) {
            // expected
        }

        $this->assertDatabaseMissing('lists', ['name' => 'Weekly Shopping']);
        $this->assertDatabaseMissing('list_items', ['name' => 'Milk']);
    }

    public function test_reorder_lists_updates_sort_order_for_own_lists(): void
    {
        $user = $this->createUserWithHousehold();
        $service = app(ListService::class);
        $listA = Liste::factory()->create(['household_id' => $user->household()->id, 'created_by' => $user->id]);
        $listB = Liste::factory()->create(['household_id' => $user->household()->id, 'created_by' => $user->id]);

        $service->reorderLists([$listB->id, $listA->id], $user);

        $this->assertDatabaseHas('list_user_order', ['user_id' => $user->id, 'list_id' => $listB->id, 'sort_order' => 0]);
        $this->assertDatabaseHas('list_user_order', ['user_id' => $user->id, 'list_id' => $listA->id, 'sort_order' => 1]);
    }

    public function test_reorder_lists_ignores_a_list_the_user_cannot_access(): void
    {
        $user = $this->createUserWithHousehold();
        $service = app(ListService::class);
        $ownList = Liste::factory()->create(['household_id' => $user->household()->id, 'created_by' => $user->id]);

        $stranger = $this->createUserWithHousehold();
        $strangersPrivateList = Liste::factory()->create([
            'household_id' => $stranger->household()->id,
            'created_by' => $stranger->id,
            'visibility' => 'private',
        ]);

        $service->reorderLists([$strangersPrivateList->id, $ownList->id], $user);

        $this->assertDatabaseHas('list_user_order', ['user_id' => $user->id, 'list_id' => $ownList->id]);
        $this->assertDatabaseMissing('list_user_order', ['user_id' => $user->id, 'list_id' => $strangersPrivateList->id]);
        $this->assertNull(DB::table('list_user_order')->where('list_id', $strangersPrivateList->id)->first());
    }
}
