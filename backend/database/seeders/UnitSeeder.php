<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UnitSeeder extends Seeder
{
    public function run(): void
    {
        $units = [
            // weight
            ['symbol' => 'mg', 'type' => 'weight', 'translations' => ['en' => 'milligram', 'cs' => 'miligram']],
            ['symbol' => 'g', 'type' => 'weight', 'translations' => ['en' => 'gram', 'cs' => 'gram']],
            ['symbol' => 'dag', 'type' => 'weight', 'translations' => ['en' => 'decagram', 'cs' => 'dekagram']],
            ['symbol' => 'kg', 'type' => 'weight', 'translations' => ['en' => 'kilogram', 'cs' => 'kilogram']],
            // volume
            ['symbol' => 'ml', 'type' => 'volume', 'translations' => ['en' => 'millilitre', 'cs' => 'mililitr']],
            ['symbol' => 'dl', 'type' => 'volume', 'translations' => ['en' => 'decilitre', 'cs' => 'decilitr']],
            ['symbol' => 'l', 'type' => 'volume', 'translations' => ['en' => 'litre', 'cs' => 'litr']],
            // cooking
            ['symbol' => 'tsp', 'type' => 'volume', 'translations' => ['en' => 'teaspoon', 'cs' => 'lžička']],
            ['symbol' => 'tbsp', 'type' => 'volume', 'translations' => ['en' => 'tablespoon', 'cs' => 'lžíce']],
            // count / piece
            ['symbol' => 'pcs', 'type' => 'piece', 'translations' => ['en' => 'piece', 'cs' => 'kus']],
            ['symbol' => 'pkg', 'type' => 'piece', 'translations' => ['en' => 'package', 'cs' => 'balení']],
            ['symbol' => 'bottle', 'type' => 'piece', 'translations' => ['en' => 'bottle', 'cs' => 'láhev']],
            ['symbol' => 'can', 'type' => 'piece', 'translations' => ['en' => 'can', 'cs' => 'plechovka']],
            ['symbol' => 'box', 'type' => 'piece', 'translations' => ['en' => 'box', 'cs' => 'krabice']],
            ['symbol' => 'bag', 'type' => 'piece', 'translations' => ['en' => 'bag', 'cs' => 'sáček']],
            ['symbol' => 'bunch', 'type' => 'count', 'translations' => ['en' => 'bunch', 'cs' => 'svazek']],
            ['symbol' => 'slice', 'type' => 'count', 'translations' => ['en' => 'slice', 'cs' => 'plátek']],
        ];

        $languages = DB::table('languages')->pluck('id', 'code');

        foreach ($units as $unit) {
            $translations = $unit['translations'];
            unset($unit['translations']);

            $unitId = DB::table('units')->updateOrInsert(
                ['symbol' => $unit['symbol']],
                array_merge($unit, ['created_at' => now(), 'updated_at' => now()])
            );

            $unitId = DB::table('units')->where('symbol', $unit['symbol'])->value('id');

            foreach ($translations as $langCode => $value) {
                $langId = $languages[$langCode] ?? null;
                if ($langId === null) {
                    continue;
                }

                DB::table('unit_translations')->updateOrInsert(
                    ['unit_id' => $unitId, 'lang_id' => $langId],
                    ['value' => $value, 'created_at' => now(), 'updated_at' => now()]
                );
            }
        }
    }
}
