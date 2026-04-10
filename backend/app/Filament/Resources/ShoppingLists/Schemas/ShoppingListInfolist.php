<?php

declare(strict_types=1);

namespace App\Filament\Resources\ShoppingLists\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ShoppingListInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make()->schema([
                TextEntry::make('name'),
                TextEntry::make('household.name')->label('Household'),
                TextEntry::make('creator.name')->label('Created by'),
                TextEntry::make('visibility')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'shared' => 'success',
                        'private' => 'gray',
                        default => 'gray',
                    }),
                TextEntry::make('created_at')->label('Created')->dateTime(),
            ])->columns(2),
        ]);
    }
}
