<?php

declare(strict_types=1);

namespace App\Enums;

enum ListVisibility: string
{
    case Shared = 'shared';
    case Private = 'private';
}
