<?php

namespace App\Service;

use App\Contracts\GreeterInterface;

class FormalGreeter implements GreeterInterface
{

    public function greet(string $name): string
    {
        return "Dobrý den, {$name}.";
    }
}
