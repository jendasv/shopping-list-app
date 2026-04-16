<?php

declare(strict_types=1);

namespace App\Filament\Resources\Lists\Pages;

use App\Filament\Resources\Lists\ListResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditList extends EditRecord
{
    protected static string $resource = ListResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    public function getRelationManagers(): array
    {
        return [];
    }
}
