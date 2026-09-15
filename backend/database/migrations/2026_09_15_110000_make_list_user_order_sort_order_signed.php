<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ListService::createList() gives a new list the next-lowest sort_order
     * (min - 1) so it sorts first — negative as soon as any list already
     * sits at sort_order 0. Postgres has no native unsigned integer type, so
     * Laravel's unsignedInteger() silently compiles to a plain `integer`
     * here — negative values were never actually rejected, but the schema
     * declared an intent ("never negative") the app was already violating
     * on every second list. Ordering is purely relative, so signed is the
     * honest type; this migration is schema-truthfulness, not a crash fix
     * (would matter for real on MySQL, which does enforce UNSIGNED).
     */
    public function up(): void
    {
        Schema::table('list_user_order', function (Blueprint $table) {
            $table->integer('sort_order')->default(0)->change();
        });
    }

    public function down(): void
    {
        Schema::table('list_user_order', function (Blueprint $table) {
            $table->unsignedInteger('sort_order')->default(0)->change();
        });
    }
};
