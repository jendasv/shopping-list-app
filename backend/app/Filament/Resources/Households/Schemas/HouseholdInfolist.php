<?php

declare(strict_types=1);

namespace App\Filament\Resources\Households\Schemas;

use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class HouseholdInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make()->schema([
                TextEntry::make('name'),
                TextEntry::make('owner.name')->label(__('Owner')),
                IconEntry::make('is_active')->label(__('Active'))->boolean(),
                TextEntry::make('created_at')->label(__('Created'))->dateTime(),
            ])->columns(2),
        ]);
    }
}
