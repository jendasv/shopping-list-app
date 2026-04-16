<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('household_id')->constrained()->cascadeOnDelete();
            $table->foreignId('global_product_id')->nullable()->constrained('global_products')->nullOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->foreignId('preferred_unit_id')->nullable()->constrained('units')->nullOnDelete();
            $table->string('name');
            $table->string('barcode', 50)->nullable()->index();
            $table->decimal('preferred_quantity', 8, 2)->nullable();
            $table->text('notes')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['household_id', 'name']);
        });

        // Add product_id to list_items — nullable, existing items stay as free text
        Schema::table('list_items', function (Blueprint $table) {
            $table->foreignId('product_id')
                ->nullable()
                ->after('list_id')
                ->constrained('products')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('list_items', function (Blueprint $table) {
            $table->dropForeign(['product_id']);
            $table->dropColumn('product_id');
        });

        Schema::dropIfExists('products');
    }
};
