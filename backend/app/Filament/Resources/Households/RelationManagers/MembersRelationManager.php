<?php

declare(strict_types=1);

namespace App\Filament\Resources\Households\RelationManagers;

use App\Filament\Resources\Users\UserResource;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class MembersRelationManager extends RelationManager
{
    protected static string $relationship = 'members';

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->url(fn ($record) => UserResource::getUrl('view', ['record' => $record])),
                TextColumn::make('email')
                    ->searchable(),
                IconColumn::make('email_verified')
                    ->label('Verified')
                    ->boolean()
                    ->getStateUsing(fn ($record) => $record->email_verified_at !== null),
                IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean(),
                TextColumn::make('pivot.role')
                    ->label('Role'),
            ])
            ->headerActions([])
            ->recordActions([])
            ->toolbarActions([]);
    }
}
