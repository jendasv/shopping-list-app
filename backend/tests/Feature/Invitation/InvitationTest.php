<?php

declare(strict_types=1);

namespace Tests\Feature\Invitation;

use App\Enums\InvitationStatus;
use App\Models\Invitation;
use App\Models\Liste;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class InvitationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Mail::fake();
    }

    // --- send ---

    public function test_owner_can_send_invitation(): void
    {
        $owner = $this->createUserWithHousehold();
        $invitee = User::factory()->create();

        $response = $this->actingAs($owner)->postJson('/api/invitations', [
            'email' => $invitee->email,
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['message' => 'Invitation sent.']);

        $this->assertDatabaseHas('invitations', [
            'email' => $invitee->email,
            'household_id' => $owner->household()->id,
            'status' => InvitationStatus::Pending->value,
        ]);
    }

    public function test_cannot_invite_unregistered_email(): void
    {
        $owner = $this->createUserWithHousehold();

        $response = $this->actingAs($owner)->postJson('/api/invitations', [
            'email' => 'nobody@example.com',
        ]);

        $response->assertStatus(422)
            ->assertJsonFragment(['error' => 'No account found with this email address.']);
    }

    public function test_cannot_invite_yourself(): void
    {
        $owner = $this->createUserWithHousehold();

        $response = $this->actingAs($owner)->postJson('/api/invitations', [
            'email' => $owner->email,
        ]);

        $response->assertStatus(422)
            ->assertJsonFragment(['error' => 'You cannot invite yourself.']);
    }

    public function test_cannot_invite_existing_member(): void
    {
        $owner = $this->createUserWithHousehold();
        $member = User::factory()->create();
        $owner->household()->members()->attach($member->id, ['role' => 'member']);

        $response = $this->actingAs($owner)->postJson('/api/invitations', [
            'email' => $member->email,
        ]);

        $response->assertStatus(422)
            ->assertJsonFragment(['error' => 'User is already a member of this household.']);
    }

    public function test_sending_new_invitation_expires_previous_pending_one(): void
    {
        $owner = $this->createUserWithHousehold();
        $invitee = User::factory()->create();

        $old = Invitation::create([
            'household_id' => $owner->household()->id,
            'invited_by' => $owner->id,
            'email' => $invitee->email,
            'token' => 'old-token',
            'status' => InvitationStatus::Pending->value,
            'expires_at' => now()->addDays(7),
        ]);

        $this->actingAs($owner)->postJson('/api/invitations', ['email' => $invitee->email]);

        $this->assertDatabaseHas('invitations', [
            'id' => $old->id,
            'status' => InvitationStatus::Expired->value,
        ]);
    }

    // --- accept ---

    public function test_user_can_accept_invitation(): void
    {
        $owner = $this->createUserWithHousehold();
        $invitee = $this->createUserWithHousehold();

        $invitation = Invitation::create([
            'household_id' => $owner->household()->id,
            'invited_by' => $owner->id,
            'email' => $invitee->email,
            'token' => 'valid-token',
            'status' => InvitationStatus::Pending->value,
            'expires_at' => now()->addDays(7),
        ]);

        $response = $this->actingAs($invitee)->postJson("/api/invitations/{$invitation->token}/accept");

        $response->assertOk()
            ->assertJsonFragment(['message' => 'Invitation accepted.']);

        $this->assertDatabaseHas('household_user', [
            'user_id' => $invitee->id,
            'household_id' => $owner->household()->id,
        ]);

        $this->assertDatabaseHas('invitations', [
            'id' => $invitation->id,
            'status' => InvitationStatus::Accepted->value,
        ]);
    }

    public function test_own_household_is_deactivated_on_accept(): void
    {
        $owner = $this->createUserWithHousehold();
        $invitee = $this->createUserWithHousehold();
        $inviteeHouseholdId = $invitee->household()->id;

        $invitation = Invitation::create([
            'household_id' => $owner->household()->id,
            'invited_by' => $owner->id,
            'email' => $invitee->email,
            'token' => 'valid-token',
            'status' => InvitationStatus::Pending->value,
            'expires_at' => now()->addDays(7),
        ]);

        $this->actingAs($invitee)->postJson("/api/invitations/{$invitation->token}/accept");

        $this->assertDatabaseHas('households', [
            'id' => $inviteeHouseholdId,
            'is_active' => false,
        ]);
    }

    public function test_lists_move_to_new_household_on_accept(): void
    {
        $owner = $this->createUserWithHousehold();
        $invitee = $this->createUserWithHousehold();

        $list = Liste::factory()->create([
            'household_id' => $invitee->household()->id,
            'created_by' => $invitee->id,
            'visibility' => 'shared',
        ]);

        $invitation = Invitation::create([
            'household_id' => $owner->household()->id,
            'invited_by' => $owner->id,
            'email' => $invitee->email,
            'token' => 'valid-token',
            'status' => InvitationStatus::Pending->value,
            'expires_at' => now()->addDays(7),
        ]);

        $this->actingAs($invitee)->postJson("/api/invitations/{$invitation->token}/accept");

        $this->assertDatabaseHas('lists', [
            'id' => $list->id,
            'household_id' => $owner->household()->id,
        ]);
    }

    public function test_expired_token_is_rejected(): void
    {
        $owner = $this->createUserWithHousehold();
        $invitee = $this->createUserWithHousehold();

        $invitation = Invitation::create([
            'household_id' => $owner->household()->id,
            'invited_by' => $owner->id,
            'email' => $invitee->email,
            'token' => 'expired-token',
            'status' => InvitationStatus::Pending->value,
            'expires_at' => now()->subDay(),
        ]);

        $response = $this->actingAs($invitee)->postJson("/api/invitations/{$invitation->token}/accept");

        $response->assertStatus(404);
    }

    public function test_nonexistent_token_is_rejected(): void
    {
        $user = $this->createUserWithHousehold();

        $response = $this->actingAs($user)->postJson('/api/invitations/nonexistent-token/accept');

        $response->assertStatus(404);
    }

    public function test_already_accepted_token_cannot_be_reused(): void
    {
        $owner = $this->createUserWithHousehold();
        $invitee = $this->createUserWithHousehold();

        $invitation = Invitation::create([
            'household_id' => $owner->household()->id,
            'invited_by' => $owner->id,
            'email' => $invitee->email,
            'token' => 'used-token',
            'status' => InvitationStatus::Accepted->value,
            'expires_at' => now()->addDays(7),
        ]);

        $response = $this->actingAs($invitee)->postJson("/api/invitations/{$invitation->token}/accept");

        $response->assertStatus(404);
    }

    // --- decline ---

    public function test_user_can_decline_invitation(): void
    {
        $owner = $this->createUserWithHousehold();
        $invitee = $this->createUserWithHousehold();

        $invitation = Invitation::create([
            'household_id' => $owner->household()->id,
            'invited_by' => $owner->id,
            'email' => $invitee->email,
            'token' => 'valid-token',
            'status' => InvitationStatus::Pending->value,
            'expires_at' => now()->addDays(7),
        ]);

        $response = $this->actingAs($invitee)->postJson("/api/invitations/{$invitation->token}/decline");

        $response->assertOk()
            ->assertJsonFragment(['message' => 'Invitation declined.']);

        $this->assertDatabaseHas('invitations', [
            'id' => $invitation->id,
            'status' => InvitationStatus::Declined->value,
        ]);
    }

    public function test_decline_does_not_change_household_membership(): void
    {
        $owner = $this->createUserWithHousehold();
        $invitee = $this->createUserWithHousehold();

        $invitation = Invitation::create([
            'household_id' => $owner->household()->id,
            'invited_by' => $owner->id,
            'email' => $invitee->email,
            'token' => 'valid-token',
            'status' => InvitationStatus::Pending->value,
            'expires_at' => now()->addDays(7),
        ]);

        $this->actingAs($invitee)->postJson("/api/invitations/{$invitation->token}/decline");

        $this->assertDatabaseMissing('household_user', [
            'user_id' => $invitee->id,
            'household_id' => $owner->household()->id,
        ]);
    }
}
