<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocaleFromUser
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($user = auth()->user()) {
            app()->setLocale($user->preferredLocale());
        }

        return $next($request);
    }
}
