<?php

declare(strict_types=1);

namespace Tests\Unit\Service;

use App\Service\OpenFoodFactsService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class OpenFoodFactsServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_timed_out_service_does_not_abort_the_lookup_for_the_others(): void
    {
        Http::fake([
            'world.openfoodfacts.org/*' => fn () => throw new ConnectionException('Connection timed out'),
            'world.openbeautyfacts.org/*' => Http::response([
                'status' => 1,
                'product' => ['product_name' => 'Test Shampoo', 'brands' => 'Acme'],
            ]),
            '*' => Http::response(['status' => 0], 404),
        ]);

        $product = app(OpenFoodFactsService::class)->fetchAndStore('1234567890123');

        $this->assertNotNull($product);
        $this->assertSame('Test Shampoo', $product->name);
    }

    public function test_returns_null_when_every_service_fails(): void
    {
        Http::fake(fn () => throw new ConnectionException('Connection timed out'));

        $product = app(OpenFoodFactsService::class)->fetchAndStore('1234567890123');

        $this->assertNull($product);
    }
}
