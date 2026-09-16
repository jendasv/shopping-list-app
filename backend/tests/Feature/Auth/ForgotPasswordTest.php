<?php

declare(strict_types=1);

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class ForgotPasswordTest extends TestCase
{
    use RefreshDatabase;

    public function test_response_is_identical_for_known_and_unknown_email(): void
    {
        $user = User::factory()->create();

        $knownResponse = $this->postJson('/api/auth/forgot-password', ['email' => $user->email]);
        $unknownResponse = $this->postJson('/api/auth/forgot-password', ['email' => 'nobody@example.com']);

        $knownResponse->assertOk();
        $unknownResponse->assertOk();
        $this->assertSame($knownResponse->json(), $unknownResponse->json());
        $this->assertSame($knownResponse->status(), $unknownResponse->status());
    }

    public function test_reset_link_is_only_actually_sent_for_a_known_email(): void
    {
        Notification::fake();

        $user = User::factory()->create();

        $this->postJson('/api/auth/forgot-password', ['email' => $user->email]);
        $this->postJson('/api/auth/forgot-password', ['email' => 'nobody@example.com']);

        Notification::assertSentTo($user, ResetPasswordNotification::class);
        Notification::assertCount(1);
    }
}
