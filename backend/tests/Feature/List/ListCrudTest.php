<?php

declare(strict_types=1);

namespace Tests\Feature\List;

use App\Models\Liste;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ListCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_fetch_their_lists(): void
    {
        $user = $this->createUserWithHousehold();
        $household = $user->household();

        Liste::factory()->create([
            'name' => 'My List',
            'household_id' => $household->id,
            'created_by' => $user->id,
            'visibility' => 'shared',
        ]);

        $response = $this->actingAs($user)->getJson('/api/lists');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonFragment(['name' => 'My List']);
    }

    public function test_unauthenticated_user_cannot_fetch_lists(): void
    {
        $this->getJson('/api/lists')->assertStatus(401);
    }

    public function test_user_can_create_a_list(): void
    {
        $user = $this->createUserWithHousehold();

        $response = $this->actingAs($user)->postJson('/api/lists', [
            'name' => 'Weekly Shopping',
            'visibility' => 'shared',
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'Weekly Shopping']);

        $this->assertDatabaseHas('lists', ['name' => 'Weekly Shopping', 'created_by' => $user->id]);
    }

    public function test_list_name_is_required(): void
    {
        $user = $this->createUserWithHousehold();

        $response = $this->actingAs($user)->postJson('/api/lists', [
            'visibility' => 'shared',
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('details.name.0', 'The name field is required.');
    }

    public function test_user_can_update_their_list(): void
    {
        $user = $this->createUserWithHousehold();
        $list = Liste::factory()->create([
            'household_id' => $user->household()->id,
            'created_by' => $user->id,
            'visibility' => 'shared',
        ]);

        $response = $this->actingAs($user)->putJson("/api/lists/{$list->id}", [
            'name' => 'Renamed List',
            'visibility' => 'shared',
        ]);

        $response->assertOk()
            ->assertJsonFragment(['name' => 'Renamed List']);

        $this->assertDatabaseHas('lists', ['id' => $list->id, 'name' => 'Renamed List']);
    }

    public function test_user_can_delete_their_list(): void
    {
        $user = $this->createUserWithHousehold();
        $list = Liste::factory()->create([
            'household_id' => $user->household()->id,
            'created_by' => $user->id,
        ]);

        $response = $this->actingAs($user)->deleteJson("/api/lists/{$list->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('lists', ['id' => $list->id]);
    }

    public function test_list_order_entry_is_created_on_new_list(): void
    {
        $user = $this->createUserWithHousehold();

        $response = $this->actingAs($user)->postJson('/api/lists', [
            'name' => 'My List',
            'visibility' => 'shared',
        ]);

        $listId = $response->json('id');

        $this->assertDatabaseHas('list_user_order', [
            'user_id' => $user->id,
            'list_id' => $listId,
        ]);
    }
}
