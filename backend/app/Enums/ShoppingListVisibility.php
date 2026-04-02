<?php

declare(strict_types=1);

namespace App\Enums;

enum ShoppingListVisibility: string
{
    case Shared = 'shared';
    case Private = 'private';
}
