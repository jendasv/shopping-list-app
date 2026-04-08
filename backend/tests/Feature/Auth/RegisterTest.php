<?php

declare(strict_types=1);

namespace Tests\Feature\Auth;

use App\Models\Household;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegisterTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['message' => 'Registration successful. Please verify your email.']);

        $this->assertDatabaseHas('users', ['email' => 'john@example.com']);
    }

    public function test_household_is_created_on_register(): void
    {
        $this->postJson('/api/auth/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $user = User::where('email', 'john@example.com')->first();

        $this->assertNotNull($user);
        $this->assertDatabaseHas('households', ['owner_id' => $user->id]);

        $household = Household::where('owner_id', $user->id)->first();
        $this->assertTrue($household->members->contains($user->id));
    }

    public function test_household_name_defaults_to_user_name(): void
    {
        $this->postJson('/api/auth/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $user = User::where('email', 'john@example.com')->first();
        $this->assertDatabaseHas('households', [
            'owner_id' => $user->id,
            'name' => "John Doe's household",
        ]);
    }

    public function test_custom_household_name_is_used_when_provided(): void
    {
        $this->postJson('/api/auth/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'household_name' => 'The Doe Family',
        ]);

        $user = User::where('email', 'john@example.com')->first();
        $this->assertDatabaseHas('households', [
            'owner_id' => $user->id,
            'name' => 'The Doe Family',
        ]);
    }

    public function test_duplicate_email_is_rejected(): void
    {
        User::factory()->create(['email' => 'john@example.com']);

        $response = $this->postJson('/api/auth/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_password_confirmation_is_required(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'different',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_required_fields_are_validated(): void
    {
        $response = $this->postJson('/api/auth/register', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'password']);
    }
}
