<?php

use App\Exceptions\ApiException;
use App\Exceptions\Domain\ValidationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\JsonResponse;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (ApiException $e): JsonResponse {
            $body = ['error' => $e->getMessage()];

            if ($e instanceof ValidationException && $e->getDetails() !== []) {
                $body['details'] = $e->getDetails();
            }

            return new JsonResponse($body, $e->getStatusCode());
        });
    })->create();
