<?php

declare(strict_types=1);

namespace App\Filament\Resources\Lists\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ListInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make()->schema([
                TextEntry::make('name'),
                TextEntry::make('household.name')->label(__('Household')),
                TextEntry::make('creator.name')->label(__('Created by')),
                TextEntry::make('visibility')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => __(ucfirst($state)))
                    ->color(fn (string $state): string => match ($state) {
                        'shared' => 'success',
                        'private' => 'gray',
                        default => 'gray',
                    }),
                TextEntry::make('created_at')->label(__('Created'))->dateTime(),
            ])->columns(2),
        ]);
    }
}
