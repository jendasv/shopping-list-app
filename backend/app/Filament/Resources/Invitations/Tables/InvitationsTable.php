<?php

declare(strict_types=1);

namespace App\Filament\Resources\Invitations\Tables;

use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class InvitationsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('email')
                    ->label(__('Invited email'))
                    ->searchable(),
                TextColumn::make('household.name')
                    ->label(__('Household'))
                    ->searchable(),
                TextColumn::make('invitedBy.name')
                    ->label(__('Invited by'))
                    ->searchable(),
                TextColumn::make('status')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => __($state === 'expired' ? 'Expired' : ucfirst($state)))
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'accepted' => 'success',
                        'declined' => 'danger',
                        'expired' => 'gray',
                        default => 'gray',
                    }),
                IconColumn::make('is_expired')
                    ->label(__('Expired'))
                    ->boolean()
                    ->getStateUsing(fn ($record) => $record->expires_at->isPast()),
                TextColumn::make('expires_at')
                    ->label(__('Expires'))
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'pending' => __('Pending'),
                        'accepted' => __('Accepted'),
                        'declined' => __('Declined'),
                        'expired' => __('Expired'),
                    ]),
            ])
            ->recordActions([
                ViewAction::make(),
                Action::make('revoke')
                    ->label(__('Revoke'))
                    ->color('danger')
                    ->icon('heroicon-o-x-circle')
                    ->requiresConfirmation()
                    ->visible(fn ($record) => $record->status === 'pending' && $record->expires_at->isFuture())
                    ->action(fn ($record) => $record->update(['status' => 'expired'])),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
