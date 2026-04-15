<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * @deprecated Use ListVisibility instead.
 */
enum ShoppingListVisibility: string
{
    case Shared = 'shared';
    case Private = 'private';
}
