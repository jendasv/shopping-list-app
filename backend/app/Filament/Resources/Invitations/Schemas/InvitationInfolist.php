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
                TextEntry::make('email')->label('Invited email'),
                TextEntry::make('household.name')->label('Household'),
                TextEntry::make('invitedBy.name')->label('Invited by'),
                TextEntry::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'accepted' => 'success',
                        'declined' => 'danger',
                        'expired' => 'gray',
                        default => 'gray',
                    }),
                TextEntry::make('expires_at')->label('Expires')->dateTime(),
                TextEntry::make('created_at')->label('Created')->dateTime(),
            ])->columns(2),
        ]);
    }
}
