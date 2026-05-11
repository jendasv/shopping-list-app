<?php

declare(strict_types=1);

namespace App\Service;

use App\Models\GlobalProduct;
use Illuminate\Http\Client\Pool;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenFoodFactsService
{
    private const DATABASES = [
        'open_food_facts'    => 'https://world.openfoodfacts.org/api/v2/product/',
        'open_beauty_facts'  => 'https://world.openbeautyfacts.org/api/v2/product/',
        'open_products_facts' => 'https://world.openproductsfacts.org/api/v2/product/',
        'open_pet_food_facts' => 'https://world.openpetfoodfacts.org/api/v2/product/',
    ];

    public function fetchAndStore(string $barcode): ?GlobalProduct
    {
        try {
            $responses = Http::pool(function (Pool $pool) use ($barcode) {
                $requests = [];
                foreach (self::DATABASES as $source => $url) {
                    $requests[] = $pool->as($source)
                        ->timeout(5)
                        ->withUserAgent('ShoppingListApp/1.0')
                        ->get($url.$barcode.'.json');
                }
                return $requests;
            });

            foreach (self::DATABASES as $source => $_) {
                $response = $responses[$source];

                if (! $response->ok()) {
                    continue;
                }

                $data = $response->json();

                if (($data['status'] ?? 0) !== 1 || empty($data['product'])) {
                    continue;
                }

                $product = $data['product'];
                $name = $product['product_name'] ?? $product['product_name_en'] ?? null;

                if (empty($name)) {
                    continue;
                }

                return GlobalProduct::firstOrCreate(
                    ['barcode' => $barcode],
                    [
                        'name'      => $name,
                        'brand'     => $product['brands'] ?? null,
                        'image_url' => $product['image_front_small_url'] ?? $product['image_url'] ?? null,
                        'source'    => $source,
                        'verified'  => false,
                        'scan_count' => 0,
                    ],
                );
            }

            return null;
        } catch (\Throwable $e) {
            Log::warning('OpenFacts lookup failed', ['barcode' => $barcode, 'error' => $e->getMessage()]);

            return null;
        }
    }
}
