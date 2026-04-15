<?php

declare(strict_types=1);

namespace Tests\Feature\Item;

use App\Models\ListItem;
use App\Models\Liste;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ItemAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_cannot_add_item_to_another_users_list(): void
    {
        $owner = $this->createUserWithHousehold();
        $other = $this->createUserWithHousehold();

        $list = Liste::factory()->create([
            'household_id' => $owner->household()->id,
            'created_by' => $owner->id,
            'visibility' => 'shared',
        ]);

        $response = $this->actingAs($other)->postJson("/api/lists/{$list->id}/items", [
            'name' => 'Milk',
            'quantity' => 1,
        ]);

        $response->assertStatus(404);
        $this->assertDatabaseMissing('list_items', ['list_id' => $list->id]);
    }

    public function test_user_cannot_update_item_on_another_users_list(): void
    {
        $owner = $this->createUserWithHousehold();
        $other = $this->createUserWithHousehold();

        $list = Liste::factory()->create([
            'household_id' => $owner->household()->id,
            'created_by' => $owner->id,
            'visibility' => 'shared',
        ]);
        $item = ListItem::factory()->create(['list_id' => $list->id]);

        $response = $this->actingAs($other)->putJson("/api/lists/{$list->id}/items/{$item->id}", [
            'name' => 'Hacked',
            'quantity' => 1,
            'isCompleted' => false,
        ]);

        $response->assertStatus(404);
        $this->assertDatabaseMissing('list_items', ['id' => $item->id, 'name' => 'Hacked']);
    }

    public function test_user_cannot_delete_item_on_another_users_list(): void
    {
        $owner = $this->createUserWithHousehold();
        $other = $this->createUserWithHousehold();

        $list = Liste::factory()->create([
            'household_id' => $owner->household()->id,
            'created_by' => $owner->id,
            'visibility' => 'shared',
        ]);
        $item = ListItem::factory()->create(['list_id' => $list->id]);

        $response = $this->actingAs($other)->deleteJson("/api/lists/{$list->id}/items/{$item->id}");

        $response->assertStatus(404);
        $this->assertDatabaseHas('list_items', ['id' => $item->id]);
    }

    public function test_household_member_can_add_item_to_shared_list(): void
    {
        $owner = $this->createUserWithHousehold();
        $member = User::factory()->create();
        $owner->household()->members()->attach($member->id, ['role' => 'member']);

        $list = Liste::factory()->create([
            'household_id' => $owner->household()->id,
            'created_by' => $owner->id,
            'visibility' => 'shared',
        ]);

        $response = $this->actingAs($member)->postJson("/api/lists/{$list->id}/items", [
            'name' => 'Butter',
            'quantity' => 1,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('list_items', ['name' => 'Butter', 'list_id' => $list->id]);
    }

    public function test_nonexistent_item_returns_404(): void
    {
        $user = $this->createUserWithHousehold();
        $list = Liste::factory()->create([
            'household_id' => $user->household()->id,
            'created_by' => $user->id,
        ]);

        $response = $this->actingAs($user)->deleteJson("/api/lists/{$list->id}/items/99999");

        $response->assertStatus(404);
    }
}
