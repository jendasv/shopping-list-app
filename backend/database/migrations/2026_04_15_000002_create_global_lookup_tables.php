<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('languages', function (Blueprint $table) {
            $table->id();
            $table->string('code', 10)->unique();
            $table->string('name_native');
            $table->string('flag_emoji', 10)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->string('symbol', 20)->unique();
            $table->string('type', 20); // weight, volume, count, piece
            $table->timestamps();
        });

        Schema::create('unit_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('unit_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lang_id')->constrained('languages')->cascadeOnDelete();
            $table->string('value');
            $table->unique(['unit_id', 'lang_id']);
            $table->timestamps();
        });

        Schema::create('global_products', function (Blueprint $table) {
            $table->id();
            $table->string('barcode', 50)->nullable()->index();
            $table->string('name');
            $table->string('brand')->nullable();
            $table->unsignedBigInteger('default_category_id')->nullable();
            $table->foreignId('default_unit_id')->nullable()->constrained('units')->nullOnDelete();
            $table->string('image_url')->nullable();
            $table->string('source', 30)->default('user_scan'); // user_scan, open_food_facts, admin
            $table->boolean('verified')->default(false);
            $table->unsignedInteger('scan_count')->default(0);
            $table->timestamps();
        });

        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('household_id')->nullable()->constrained()->cascadeOnDelete();
            $table->boolean('is_global')->default(false);
            $table->string('name')->nullable(); // only for custom household categories
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        // FK from global_products to categories (after categories table exists)
        Schema::table('global_products', function (Blueprint $table) {
            $table->foreign('default_category_id')->references('id')->on('categories')->nullOnDelete();
        });

        Schema::create('category_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lang_id')->constrained('languages')->cascadeOnDelete();
            $table->string('value');
            $table->unique(['category_id', 'lang_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::table('global_products', function (Blueprint $table) {
            $table->dropForeign(['default_category_id']);
        });

        Schema::dropIfExists('category_translations');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('global_products');
        Schema::dropIfExists('unit_translations');
        Schema::dropIfExists('units');
        Schema::dropIfExists('languages');
    }
};
