<?php

declare(strict_types=1);

namespace App\Filament\Resources\Lists\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ItemsRelationManager extends RelationManager
{
    protected static string $relationship = 'items';

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->searchable(),
                TextColumn::make('quantity'),
                IconColumn::make('is_completed')
                    ->label(__('Completed'))
                    ->boolean(),
                TextColumn::make('created_at')
                    ->label(__('Added'))
                    ->dateTime()
                    ->sortable(),
            ])
            ->defaultSort('is_completed')
            ->headerActions([])
            ->recordActions([])
            ->toolbarActions([]);
    }
}
