<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add owner_id to households — cascade delete when owner user is deleted
        Schema::table('households', function (Blueprint $table) {
            $table->foreignId('owner_id')->nullable()->after('id')->constrained('users')->cascadeOnDelete();
        });

        // Fix shopping_list.household_id — cascade delete when household is deleted
        Schema::table('shopping_list', function (Blueprint $table) {
            $table->dropForeign(['household_id']);
            $table->foreign('household_id')->references('id')->on('households')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('shopping_list', function (Blueprint $table) {
            $table->dropForeign(['household_id']);
            $table->foreign('household_id')->references('id')->on('households')->nullOnDelete();
        });

        Schema::table('households', function (Blueprint $table) {
            $table->dropForeign(['owner_id']);
            $table->dropColumn('owner_id');
        });
    }
};
