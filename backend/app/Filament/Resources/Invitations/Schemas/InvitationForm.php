<?php

declare(strict_types=1);

namespace App\Filament\Resources\Invitations\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class InvitationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('email')
                    ->label('Invited email')
                    ->email()
                    ->disabled(),
                Select::make('household_id')
                    ->relationship('household', 'name')
                    ->disabled(),
                Select::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'accepted' => 'Accepted',
                        'declined' => 'Declined',
                        'expired' => 'Expired',
                    ])
                    ->required(),
                DateTimePicker::make('expires_at')
                    ->required(),
            ]);
    }
}
