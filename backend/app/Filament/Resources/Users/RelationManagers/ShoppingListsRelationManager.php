<?php

declare(strict_types=1);

namespace App\Filament\Resources\Users\RelationManagers;

use App\Filament\Resources\ShoppingLists\ShoppingListResource;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ShoppingListsRelationManager extends RelationManager
{
    protected static string $relationship = 'shoppingLists';

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->url(fn ($record) => ShoppingListResource::getUrl('view', ['record' => $record])),
                TextColumn::make('visibility')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'shared' => 'success',
                        'private' => 'gray',
                        default => 'gray',
                    }),
                TextColumn::make('items_count')
                    ->label(__('Items'))
                    ->counts('items'),
                TextColumn::make('created_at')
                    ->label(__('Created'))
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('visibility')
                    ->options([
                        'private' => __('Private'),
                        'shared' => __('Shared'),
                    ]),
            ])
            ->headerActions([])
            ->recordActions([])
            ->toolbarActions([]);
    }
}
