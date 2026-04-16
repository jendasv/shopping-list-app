<?php

declare(strict_types=1);

namespace App\Providers;

use App\Models\Household;
use App\Models\Invitation;
use App\Models\Liste;
use App\Models\Product;
use App\Policies\HouseholdPolicy;
use App\Policies\InvitationPolicy;
use App\Policies\ListePolicy;
use App\Policies\ProductPolicy;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
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
        $this->registerPolicies();
        $this->registerRateLimiters();

        Broadcast::routes(['middleware' => ['auth:sanctum']]);

        VerifyEmail::createUrlUsing(function (object $notifiable): string {
            URL::forceRootUrl(config('app.url'));

            return URL::temporarySignedRoute(
                'verification.verify',
                now()->addMinutes((int) config('auth.verification.expire', 60)),
                ['id' => $notifiable->getKey(), 'hash' => sha1($notifiable->getEmailForVerification())]
            );
        });

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
    private function registerPolicies(): void
    {
        Gate::policy(Liste::class, ListePolicy::class);
        Gate::policy(Household::class, HouseholdPolicy::class);
        Gate::policy(Invitation::class, InvitationPolicy::class);
        Gate::policy(Product::class, ProductPolicy::class);
    }

    private function registerRateLimiters(): void
    {
        // Auth endpoints — per IP, strict
        RateLimiter::for('auth', function (Request $request) {
            return Limit::perMinute(10)->by($request->ip());
        });

        // Global API — per user or IP
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(120)->by($request->user()?->id ?: $request->ip());
        });
    }

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
