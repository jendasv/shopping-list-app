<?php

namespace Tests;

use App\Enums\HouseholdRole;
use App\Models\Household;
use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Testing\TestResponse;

abstract class TestCase extends BaseTestCase
{
    /**
     * Simulate a stateful SPA request (required for session-based auth endpoints like login/logout).
     *
     * @param array<string, mixed> $data
     */
    protected function spaPostJson(string $uri, array $data = []): TestResponse
    {
        return $this->withHeader('Origin', 'http://localhost')
            ->postJson($uri, $data);
    }

    /**
     * Create a user with an associated household (mirrors the registration flow).
     */
    protected function createUserWithHousehold(?string $householdName = null): User
    {
        $user = User::factory()->create();
        $household = Household::create([
            'name' => $householdName ?? "{$user->name}'s household",
            'owner_id' => $user->id,
        ]);
        $household->members()->attach($user->id, ['role' => HouseholdRole::Owner->value]);

        return $user;
    }
}
