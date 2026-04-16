<?php

declare(strict_types=1);

namespace App\Filament\Resources\Lists\Pages;

use App\Filament\Resources\Lists\ListResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewList extends ViewRecord
{
    protected static string $resource = ListResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
