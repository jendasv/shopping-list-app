<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LanguageSeeder extends Seeder
{
    public function run(): void
    {
        $languages = [
            ['code' => 'en', 'name_native' => 'English', 'flag_emoji' => '🇬🇧', 'is_active' => true],
            ['code' => 'cs', 'name_native' => 'Čeština', 'flag_emoji' => '🇨🇿', 'is_active' => true],
            ['code' => 'de', 'name_native' => 'Deutsch', 'flag_emoji' => '🇩🇪', 'is_active' => false],
            ['code' => 'sk', 'name_native' => 'Slovenčina', 'flag_emoji' => '🇸🇰', 'is_active' => false],
            ['code' => 'pl', 'name_native' => 'Polski', 'flag_emoji' => '🇵🇱', 'is_active' => false],
            ['code' => 'fr', 'name_native' => 'Français', 'flag_emoji' => '🇫🇷', 'is_active' => false],
        ];

        foreach ($languages as $language) {
            DB::table('languages')->updateOrInsert(
                ['code' => $language['code']],
                array_merge($language, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }
    }
}
