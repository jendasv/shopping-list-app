<?php

declare(strict_types=1);

namespace App\Filament\Widgets;

use App\Models\Household;
use App\Models\ShoppingList;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total users', User::count())
                ->description('Registered accounts')
                ->color('primary'),
            Stat::make('Active households', Household::where('is_active', true)->count())
                ->description('Out of '.Household::count().' total')
                ->color('success'),
            Stat::make('Shopping lists', ShoppingList::count())
                ->description('Across all households')
                ->color('info'),
        ];
    }
}
