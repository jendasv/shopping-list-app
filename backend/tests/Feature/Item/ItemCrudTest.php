<?php

declare(strict_types=1);

namespace Tests\Feature\Item;

use App\Models\ListItem;
use App\Models\Liste;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ItemCrudTest extends TestCase
{
    use RefreshDatabase;

    private function makeList(): array
    {
        $user = $this->createUserWithHousehold();
        $list = Liste::factory()->create([
            'household_id' => $user->household()->id,
            'created_by' => $user->id,
            'visibility' => 'shared',
        ]);

        return [$user, $list];
    }

    public function test_user_can_add_item_to_list(): void
    {
        [$user, $list] = $this->makeList();

        $response = $this->actingAs($user)->postJson("/api/lists/{$list->id}/items", [
            'name' => 'Milk',
            'quantity' => 2,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('list_items', ['name' => 'Milk', 'quantity' => 2, 'list_id' => $list->id]);
    }

    public function test_item_name_is_required(): void
    {
        [$user, $list] = $this->makeList();

        $response = $this->actingAs($user)->postJson("/api/lists/{$list->id}/items", [
            'quantity' => 1,
        ]);

        $response->assertStatus(400)
            ->assertJsonPath('details.name.0', 'The name field is required.');
    }

    public function test_item_quantity_must_be_positive(): void
    {
        [$user, $list] = $this->makeList();

        $response = $this->actingAs($user)->postJson("/api/lists/{$list->id}/items", [
            'name' => 'Milk',
            'quantity' => 0,
        ]);

        $response->assertStatus(400)
            ->assertJsonPath('details.quantity.0', 'The quantity field must be at least 0.01.');
    }

    public function test_user_can_update_item(): void
    {
        [$user, $list] = $this->makeList();
        $item = ListItem::factory()->create(['list_id' => $list->id, 'name' => 'Milk', 'quantity' => 1]);

        $response = $this->actingAs($user)->putJson("/api/lists/{$list->id}/items/{$item->id}", [
            'name' => 'Oat Milk',
            'quantity' => 3,
            'isCompleted' => false,
        ]);

        $response->assertOk();
        $this->assertDatabaseHas('list_items', ['id' => $item->id, 'name' => 'Oat Milk', 'quantity' => 3]);
    }

    public function test_user_can_mark_item_as_completed(): void
    {
        [$user, $list] = $this->makeList();
        $item = ListItem::factory()->create(['list_id' => $list->id, 'is_completed' => false]);

        $this->actingAs($user)->putJson("/api/lists/{$list->id}/items/{$item->id}", [
            'name' => $item->name,
            'quantity' => $item->quantity,
            'isCompleted' => true,
        ]);

        $this->assertDatabaseHas('list_items', ['id' => $item->id, 'is_completed' => true]);
    }

    public function test_user_can_delete_item(): void
    {
        [$user, $list] = $this->makeList();
        $item = ListItem::factory()->create(['list_id' => $list->id]);

        $response = $this->actingAs($user)->deleteJson("/api/lists/{$list->id}/items/{$item->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('list_items', ['id' => $item->id]);
    }

    public function test_unauthenticated_user_cannot_add_item(): void
    {
        [$user, $list] = $this->makeList();

        $response = $this->postJson("/api/lists/{$list->id}/items", [
            'name' => 'Milk',
            'quantity' => 1,
        ]);

        $response->assertStatus(401);
    }
}
