<?php

declare(strict_types=1);

namespace Tests\Unit\Providers;

use App\Providers\AppServiceProvider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Tests\TestCase;

class AppServiceProviderTest extends TestCase
{
    use RefreshDatabase;

    public function test_private_ip_origin_widens_stateful_domains_in_local_env(): void
    {
        $this->app->detectEnvironment(fn () => 'local');
        $this->app->instance('request', Request::create('/', 'GET', server: ['HTTP_ORIGIN' => 'http://192.168.1.50']));

        (new AppServiceProvider($this->app))->boot();

        $this->assertContains('192.168.1.50', config('sanctum.stateful'));
    }

    public function test_private_ip_origin_is_ignored_outside_local_env(): void
    {
        // Origin/Referer are attacker-controlled — this must never widen
        // Sanctum's stateful domains outside local dev.
        $this->app->detectEnvironment(fn () => 'production');
        $this->app->instance('request', Request::create('/', 'GET', server: ['HTTP_ORIGIN' => 'http://192.168.1.50']));

        $before = config('sanctum.stateful');

        (new AppServiceProvider($this->app))->boot();

        $this->assertSame($before, config('sanctum.stateful'));
    }
}
