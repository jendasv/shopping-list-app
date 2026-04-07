<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('list_user_order', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->unsignedBigInteger('shopping_list_id');
            $table->foreign('shopping_list_id')->references('id')->on('shopping_list')->cascadeOnDelete();
            $table->unsignedInteger('sort_order')->default(0);
            $table->primary(['user_id', 'shopping_list_id']);
        });

        Schema::table('shopping_list', function (Blueprint $table) {
            $table->dropColumn('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('list_user_order');

        Schema::table('shopping_list', function (Blueprint $table) {
            $table->unsignedInteger('sort_order')->default(0)->after('visibility');
        });
    }
};
