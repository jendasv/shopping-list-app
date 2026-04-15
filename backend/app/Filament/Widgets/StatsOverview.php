<?php

declare(strict_types=1);

namespace App\Filament\Widgets;

use App\Models\Household;
use App\Models\Liste;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        $totalHouseholds = Household::count();

        return [
            Stat::make(__('Total users'), User::count())
                ->description(__('Registered accounts'))
                ->color('primary'),
            Stat::make(__('Active households'), Household::where('is_active', true)->count())
                ->description(__('Out of :count total', ['count' => $totalHouseholds]))
                ->color('success'),
            Stat::make(__('Shopping lists'), Liste::count())
                ->description(__('Across all households'))
                ->color('info'),
        ];
    }
}
