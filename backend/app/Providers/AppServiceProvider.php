<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Broadcast::routes(['middleware' => ['auth:sanctum']]);

        ResetPassword::createUrlUsing(function (object $user, string $token): string {
            return config('app.frontend_url')
                .'/reset-password?token='.$token
                .'&email='.urlencode($user->email);
        });

        $this->allowPrivateLanOrigin();
    }

    /**
     * Dynamically add private LAN IP origins to Sanctum stateful domains.
     * This allows any device on a private network to use the app without config changes.
     */
    private function allowPrivateLanOrigin(): void
    {
        $origin = request()->header('Origin') ?? request()->header('Referer');
        if (! $origin) {
            return;
        }

        $host = parse_url($origin, PHP_URL_HOST);
        if (! $host || ! $this->isPrivateIp($host)) {
            return;
        }

        $port = parse_url($origin, PHP_URL_PORT);
        $domain = $host.($port ? ':'.$port : '');

        /** @var string[] $stateful */
        $stateful = config('sanctum.stateful', []);
        config(['sanctum.stateful' => array_unique([...$stateful, $domain])]);
    }

    private function isPrivateIp(string $host): bool
    {
        return (bool) filter_var(
            $host,
            FILTER_VALIDATE_IP,
            FILTER_FLAG_IPV4 | FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
        ) === false
            && filter_var($host, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4) !== false;
    }
}
