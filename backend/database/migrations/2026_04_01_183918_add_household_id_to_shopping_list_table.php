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
        Schema::table('shopping_list', function (Blueprint $table) {
            $table->foreignId('household_id')->nullable()->after('id')->constrained()->nullOnDelete();
            $table->foreignId('created_by')->nullable()->after('household_id')->constrained('users')->nullOnDelete();
            $table->enum('visibility', ['shared', 'private'])->default('shared')->after('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shopping_list', function (Blueprint $table) {
            $table->dropForeign(['household_id']);
            $table->dropForeign(['created_by']);
            $table->dropColumn(['household_id', 'created_by', 'visibility']);
        });
    }
};
