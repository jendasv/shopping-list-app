<?php

declare(strict_types=1);

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_with_correct_credentials(): void
    {
        $user = User::factory()->create(['password' => bcrypt('password123')]);

        $response = $this->spaPostJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['user' => ['id', 'name', 'email']]);
    }

    public function test_wrong_password_is_rejected(): void
    {
        $user = User::factory()->create(['password' => bcrypt('password123')]);

        $response = $this->spaPostJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_nonexistent_email_is_rejected(): void
    {
        $response = $this->spaPostJson('/api/auth/login', [
            'email' => 'nobody@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_required_fields_are_validated(): void
    {
        $response = $this->spaPostJson('/api/auth/login', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_authenticated_user_is_returned(): void
    {
        $user = User::factory()->create([
            'name' => 'John Doe',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->spaPostJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertOk()
            ->assertJsonPath('user.name', 'John Doe')
            ->assertJsonPath('user.email', $user->email);
    }
}
