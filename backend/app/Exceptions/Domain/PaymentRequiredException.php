<?php

declare(strict_types=1);

namespace App\Exceptions\Domain;

use App\Exceptions\ApiException;

class PaymentRequiredException extends ApiException
{
    public function __construct(string $message = 'Upgrade to Pro to continue.')
    {
        parent::__construct($message, 402);
    }
}
