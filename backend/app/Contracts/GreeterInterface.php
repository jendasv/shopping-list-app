<?php

namespace App\Contracts;

interface GreeterInterface
{
    public function greet(string $name): string;
}
