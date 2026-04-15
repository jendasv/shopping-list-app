<?php

declare(strict_types=1);

namespace App\Filament\Resources\Users\Schemas;

use App\Models\Item;
use App\Models\Liste;
use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class UserInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make(fn () => __('User details'))->schema([
                TextEntry::make('name'),
                TextEntry::make('email'),
                IconEntry::make('email_verified')
                    ->label(fn () => __('Email verified'))
                    ->boolean()
                    ->getStateUsing(fn ($record) => $record->email_verified_at !== null),
                IconEntry::make('is_active')->label(fn () => __('Active'))->boolean(),
                IconEntry::make('is_super_admin')->label(fn () => __('Superadmin'))->boolean(),
                TextEntry::make('created_at')->label(fn () => __('Registered'))->dateTime(),
            ])->columns(2),

            Section::make(fn () => __('Statistics'))->schema([
                TextEntry::make('private_lists')
                    ->label(fn () => __('Private lists'))
                    ->getStateUsing(fn ($record) => $record->shoppingLists()->where('visibility', 'private')->count()),
                TextEntry::make('shared_lists')
                    ->label(fn () => __('Shared lists'))
                    ->getStateUsing(fn ($record) => $record->shoppingLists()->where('visibility', 'shared')->count()),
                TextEntry::make('visible_items')
                    ->label(fn () => __('Visible items'))
                    ->getStateUsing(function ($record) {
                        $ownListIds = $record->shoppingLists()->pluck('id');

                        $householdSharedListIds = collect();
                        $household = $record->household();
                        if ($household) {
                            $householdSharedListIds = Liste::where('household_id', $household->id)
                                ->where('visibility', 'shared')
                                ->pluck('id');
                        }

                        $allIds = $ownListIds->merge($householdSharedListIds)->unique();

                        return Item::whereIn('shopping_list_id', $allIds)->count();
                    }),
            ])->columns(3),
        ]);
    }
}
