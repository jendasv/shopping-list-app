<?php

declare(strict_types=1);

namespace Tests\Feature\ShoppingList;

use App\Models\ShoppingList;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShoppingListAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_cannot_view_another_users_list(): void
    {
        $owner = $this->createUserWithHousehold();
        $other = $this->createUserWithHousehold();

        $list = ShoppingList::factory()->create([
            'household_id' => $owner->household()->id,
            'created_by' => $owner->id,
            'visibility' => 'shared',
        ]);

        $response = $this->actingAs($other)->getJson("/api/lists/{$list->id}/items");

        $response->assertStatus(404);
    }

    public function test_user_cannot_update_another_users_list(): void
    {
        $owner = $this->createUserWithHousehold();
        $other = $this->createUserWithHousehold();

        $list = ShoppingList::factory()->create([
            'household_id' => $owner->household()->id,
            'created_by' => $owner->id,
            'visibility' => 'shared',
        ]);

        $response = $this->actingAs($other)->putJson("/api/lists/{$list->id}", [
            'name' => 'Hacked',
            'visibility' => 'shared',
        ]);

        $response->assertStatus(404);
    }

    public function test_user_cannot_delete_another_users_list(): void
    {
        $owner = $this->createUserWithHousehold();
        $other = $this->createUserWithHousehold();

        $list = ShoppingList::factory()->create([
            'household_id' => $owner->household()->id,
            'created_by' => $owner->id,
            'visibility' => 'shared',
        ]);

        $response = $this->actingAs($other)->deleteJson("/api/lists/{$list->id}");

        $response->assertStatus(404);
        $this->assertDatabaseHas('shopping_list', ['id' => $list->id]);
    }

    public function test_shared_list_is_visible_to_household_members(): void
    {
        $owner = $this->createUserWithHousehold();
        $member = User::factory()->create();
        $owner->household()->members()->attach($member->id, ['role' => 'member']);

        $list = ShoppingList::factory()->create([
            'household_id' => $owner->household()->id,
            'created_by' => $owner->id,
            'visibility' => 'shared',
        ]);

        $response = $this->actingAs($member)->getJson("/api/lists/{$list->id}/items");

        $response->assertOk();
    }

    public function test_private_list_is_not_visible_to_household_members(): void
    {
        $owner = $this->createUserWithHousehold();
        $member = User::factory()->create();
        $owner->household()->members()->attach($member->id, ['role' => 'member']);

        $list = ShoppingList::factory()->create([
            'household_id' => $owner->household()->id,
            'created_by' => $owner->id,
            'visibility' => 'private',
        ]);

        $response = $this->actingAs($member)->getJson("/api/lists/{$list->id}/items");

        $response->assertStatus(404);
    }
}
