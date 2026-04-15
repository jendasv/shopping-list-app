<?php

declare(strict_types=1);

namespace App\Providers\Filament;

use App\Filament\Widgets\StatsOverview;
use App\Http\Middleware\SetLocaleFromUser;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Navigation\MenuItem;
use Filament\Pages\Dashboard;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Widgets\AccountWidget;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            ->brandName('Shopping List Admin')
            ->colors([
                'primary' => Color::Indigo,
            ])
            ->userMenuItems([
                MenuItem::make()
                    ->label('English')
                    ->icon('heroicon-o-language')
                    ->url(fn () => route('admin.locale', 'en'))
                    ->visible(fn () => auth()->user()?->preferredLocale() !== 'en'),
                MenuItem::make()
                    ->label('Čeština')
                    ->icon('heroicon-o-language')
                    ->url(fn () => route('admin.locale', 'cs'))
                    ->visible(fn () => auth()->user()?->preferredLocale() !== 'cs'),
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\Filament\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\Filament\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\Filament\Widgets')
            ->widgets([
                StatsOverview::class,
                AccountWidget::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                PreventRequestForgery::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
                SetLocaleFromUser::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}
