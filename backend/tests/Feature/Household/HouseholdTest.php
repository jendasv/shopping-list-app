<?php

declare(strict_types=1);

namespace Tests\Feature\Household;

use App\Models\Liste;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HouseholdTest extends TestCase
{
    use RefreshDatabase;

    // --- show ---

    public function test_user_can_view_their_household(): void
    {
        $user = $this->createUserWithHousehold('Doe Family');

        $response = $this->actingAs($user)->getJson('/api/household');

        $response->assertOk()
            ->assertJsonPath('ownHousehold.name', 'Doe Family')
            ->assertJsonStructure(['ownHousehold' => ['id', 'name', 'members'], 'joinedHouseholds']);
    }

    public function test_unauthenticated_user_cannot_view_household(): void
    {
        $this->getJson('/api/household')->assertStatus(401);
    }

    public function test_household_members_are_listed(): void
    {
        $owner = $this->createUserWithHousehold();
        $member = User::factory()->create(['name' => 'Jane Doe']);
        $owner->household()->members()->attach($member->id, ['role' => 'member']);

        $response = $this->actingAs($owner)->getJson('/api/household');

        $response->assertOk()
            ->assertJsonCount(2, 'ownHousehold.members');
    }

    public function test_joined_households_are_listed(): void
    {
        $owner = $this->createUserWithHousehold();
        $member = $this->createUserWithHousehold();
        $owner->household()->members()->attach($member->id, ['role' => 'member']);

        $response = $this->actingAs($member)->getJson('/api/household');

        $response->assertOk()
            ->assertJsonCount(1, 'joinedHouseholds');
    }

    // --- update ---

    public function test_owner_can_rename_household(): void
    {
        $user = $this->createUserWithHousehold('Old Name');

        $response = $this->actingAs($user)->putJson('/api/household', ['name' => 'New Name']);

        $response->assertOk()
            ->assertJsonPath('household.name', 'New Name');

        $this->assertDatabaseHas('households', ['id' => $user->household()->id, 'name' => 'New Name']);
    }

    public function test_household_name_is_required_on_update(): void
    {
        $user = $this->createUserWithHousehold();

        $response = $this->actingAs($user)->putJson('/api/household', ['name' => '']);

        $response->assertStatus(422);
    }

    // --- leave ---

    public function test_member_can_leave_household(): void
    {
        $owner = $this->createUserWithHousehold();
        $member = $this->createUserWithHousehold();
        $owner->household()->members()->attach($member->id, ['role' => 'member']);

        $response = $this->actingAs($member)->postJson("/api/household/{$owner->household()->id}/leave");

        $response->assertOk()
            ->assertJsonFragment(['message' => 'Left household successfully.']);

        $this->assertDatabaseMissing('household_user', [
            'user_id' => $member->id,
            'household_id' => $owner->household()->id,
        ]);
    }

    public function test_owner_cannot_leave_their_own_household(): void
    {
        $owner = $this->createUserWithHousehold();

        $response = $this->actingAs($owner)->postJson("/api/household/{$owner->household()->id}/leave");

        $response->assertStatus(404);
    }

    public function test_private_lists_move_to_own_household_on_leave(): void
    {
        $owner = $this->createUserWithHousehold();
        $member = $this->createUserWithHousehold();
        $owner->household()->members()->attach($member->id, ['role' => 'member']);

        $privateList = Liste::factory()->create([
            'household_id' => $owner->household()->id,
            'created_by' => $member->id,
            'visibility' => 'private',
        ]);

        $this->actingAs($member)->postJson("/api/household/{$owner->household()->id}/leave");

        $this->assertDatabaseHas('lists', [
            'id' => $privateList->id,
            'household_id' => $member->household()->id,
        ]);
    }

    public function test_shared_lists_stay_in_household_on_leave(): void
    {
        $owner = $this->createUserWithHousehold();
        $member = $this->createUserWithHousehold();
        $owner->household()->members()->attach($member->id, ['role' => 'member']);

        $sharedList = Liste::factory()->create([
            'household_id' => $owner->household()->id,
            'created_by' => $member->id,
            'visibility' => 'shared',
        ]);

        $this->actingAs($member)->postJson("/api/household/{$owner->household()->id}/leave");

        $this->assertDatabaseHas('lists', [
            'id' => $sharedList->id,
            'household_id' => $owner->household()->id,
        ]);
    }
}
