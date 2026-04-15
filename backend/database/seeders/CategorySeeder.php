<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['en' => 'Bakery', 'cs' => 'Pečivo'],
            ['en' => 'Dairy & Eggs', 'cs' => 'Mléčné výrobky a vejce'],
            ['en' => 'Fruit & Vegetables', 'cs' => 'Ovoce a zelenina'],
            ['en' => 'Meat & Fish', 'cs' => 'Maso a ryby'],
            ['en' => 'Frozen', 'cs' => 'Mražené'],
            ['en' => 'Beverages', 'cs' => 'Nápoje'],
            ['en' => 'Dry & Canned Goods', 'cs' => 'Trvanlivé potraviny'],
            ['en' => 'Sweets & Snacks', 'cs' => 'Sladkosti a snacky'],
            ['en' => 'Condiments & Spices', 'cs' => 'Koření a dochucovadla'],
            ['en' => 'Deli', 'cs' => 'Lahůdky a uzeniny'],
            ['en' => 'Health & Beauty', 'cs' => 'Drogerie a kosmetika'],
            ['en' => 'Household Supplies', 'cs' => 'Čisticí prostředky'],
            ['en' => 'Baby', 'cs' => 'Dětské zboží'],
            ['en' => 'Pet', 'cs' => 'Zvířata'],
            ['en' => 'Electronics', 'cs' => 'Elektronika'],
            ['en' => 'Clothing', 'cs' => 'Oblečení'],
            ['en' => 'Sports & Outdoors', 'cs' => 'Sport a outdoor'],
            ['en' => 'Home & Garden', 'cs' => 'Dům a zahrada'],
            ['en' => 'Pharmacy', 'cs' => 'Lékárna'],
            ['en' => 'Other', 'cs' => 'Ostatní'],
        ];

        $languages = DB::table('languages')->pluck('id', 'code');
        $enId = $languages['en'] ?? null;
        $csId = $languages['cs'] ?? null;

        foreach ($categories as $sort => $translations) {
            // Check if global category with this EN translation already exists
            $existing = null;
            if ($enId) {
                $existing = DB::table('category_translations')
                    ->join('categories', 'categories.id', '=', 'category_translations.category_id')
                    ->where('categories.is_global', true)
                    ->where('category_translations.lang_id', $enId)
                    ->where('category_translations.value', $translations['en'])
                    ->value('categories.id');
            }

            if ($existing) {
                $categoryId = $existing;
            } else {
                $categoryId = DB::table('categories')->insertGetId([
                    'household_id' => null,
                    'is_global' => true,
                    'name' => null,
                    'sort_order' => $sort,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            foreach (['en' => $enId, 'cs' => $csId] as $langCode => $langId) {
                if ($langId === null) {
                    continue;
                }

                DB::table('category_translations')->updateOrInsert(
                    ['category_id' => $categoryId, 'lang_id' => $langId],
                    ['value' => $translations[$langCode], 'created_at' => now(), 'updated_at' => now()]
                );
            }
        }
    }
}
