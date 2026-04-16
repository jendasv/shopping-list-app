<?php

declare(strict_types=1);

namespace App\Filament\Resources\GlobalProducts\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class GlobalProductsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('brand')
                    ->searchable()
                    ->placeholder('—'),
                TextColumn::make('barcode')
                    ->searchable()
                    ->placeholder('—')
                    ->toggleable(),
                TextColumn::make('source')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'open_food_facts' => 'info',
                        'user_scan' => 'warning',
                        'admin' => 'success',
                        default => 'gray',
                    }),
                IconColumn::make('verified')
                    ->boolean()
                    ->sortable(),
                TextColumn::make('scan_count')
                    ->label(__('Scans'))
                    ->sortable(),
                TextColumn::make('defaultCategory.name')
                    ->label(__('Category'))
                    ->placeholder('—')
                    ->toggleable(),
                TextColumn::make('defaultUnit.symbol')
                    ->label(__('Unit'))
                    ->placeholder('—')
                    ->toggleable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('scan_count', 'desc')
            ->filters([
                SelectFilter::make('source')
                    ->options([
                        'user_scan' => __('User scan'),
                        'open_food_facts' => __('Open Food Facts'),
                        'admin' => __('Admin'),
                    ]),
                TernaryFilter::make('verified')
                    ->label(__('Verified')),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
