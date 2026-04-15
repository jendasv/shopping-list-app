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
                    ->label(__('Invited email'))
                    ->email()
                    ->disabled(),
                Select::make('household_id')
                    ->relationship('household', 'name')
                    ->disabled(),
                Select::make('status')
                    ->options([
                        'pending' => __('Pending'),
                        'accepted' => __('Accepted'),
                        'declined' => __('Declined'),
                        'expired' => __('Expired'),
                    ])
                    ->required(),
                DateTimePicker::make('expires_at')
                    ->required(),
            ]);
    }
}
