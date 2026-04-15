<?php

declare(strict_types=1);

namespace App\Filament\Resources\Invitations\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class InvitationInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make()->schema([
                TextEntry::make('email')->label(__('Invited email')),
                TextEntry::make('household.name')->label(__('Household')),
                TextEntry::make('invitedBy.name')->label(__('Invited by')),
                TextEntry::make('status')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => __($state === 'expired' ? 'Expired' : ucfirst($state)))
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'accepted' => 'success',
                        'declined' => 'danger',
                        'expired' => 'gray',
                        default => 'gray',
                    }),
                TextEntry::make('expires_at')->label(__('Expires'))->dateTime(),
                TextEntry::make('created_at')->label(__('Created'))->dateTime(),
            ])->columns(2),
        ]);
    }
}
