<?php

declare(strict_types=1);

namespace App\Exceptions\Infrastructure;

use App\Exceptions\ApiException;
use Illuminate\Support\Facades\Log;

class DatabaseOperationException extends ApiException
{
    public function __construct(string $message)
    {
        Log::error($message);
        $public = app()->isProduction() ? 'A server error occurred. Please try again.' : $message;
        parent::__construct($public, 500);
    }
}
