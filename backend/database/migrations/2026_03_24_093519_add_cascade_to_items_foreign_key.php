<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('item', function (Blueprint $table) {
            // nejdřív smaž starý FK
            $table->dropForeign(['shopping_list_id']);

            // vytvoř nový FK s cascade
            $table->foreign('shopping_list_id')
                ->references('id')->on('shopping_list')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('item', function (Blueprint $table) {
            $table->dropForeign(['shopping_list_id']);
            $table->foreign('shopping_list_id')
                ->references('id')->on('shopping_list');
        });
    }
};
