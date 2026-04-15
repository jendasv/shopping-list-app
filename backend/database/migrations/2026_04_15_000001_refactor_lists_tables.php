<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Rename shopping_list → lists
        Schema::rename('shopping_list', 'lists');

        Schema::table('lists', function (Blueprint $table) {
            $table->string('list_type', 20)->default('shopping')->after('name');
            $table->string('status', 20)->default('active')->after('list_type');
        });

        // 2. Rename item → list_items
        Schema::rename('item', 'list_items');

        Schema::table('list_items', function (Blueprint $table) {
            $table->renameColumn('shopping_list_id', 'list_id');
        });

        Schema::table('list_items', function (Blueprint $table) {
            $table->decimal('quantity', 8, 2)->nullable()->change();
            $table->unsignedBigInteger('unit_id')->nullable()->after('quantity');
            $table->text('notes')->nullable()->after('is_completed');
        });

        // 3. Update list_user_order: drop old FK + primary, rename column, recreate
        DB::statement('ALTER TABLE list_user_order DROP CONSTRAINT IF EXISTS list_user_order_shopping_list_id_foreign');
        DB::statement('ALTER TABLE list_user_order DROP CONSTRAINT IF EXISTS list_user_order_pkey');
        DB::statement('ALTER TABLE list_user_order RENAME COLUMN shopping_list_id TO list_id');
        DB::statement('ALTER TABLE list_user_order ADD CONSTRAINT list_user_order_list_id_foreign FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE');
        DB::statement('ALTER TABLE list_user_order ADD PRIMARY KEY (user_id, list_id)');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE list_user_order DROP CONSTRAINT IF EXISTS list_user_order_list_id_foreign');
        DB::statement('ALTER TABLE list_user_order DROP CONSTRAINT IF EXISTS list_user_order_pkey');
        DB::statement('ALTER TABLE list_user_order RENAME COLUMN list_id TO shopping_list_id');
        DB::statement('ALTER TABLE list_user_order ADD CONSTRAINT list_user_order_shopping_list_id_foreign FOREIGN KEY (shopping_list_id) REFERENCES lists(id) ON DELETE CASCADE');
        DB::statement('ALTER TABLE list_user_order ADD PRIMARY KEY (user_id, shopping_list_id)');

        Schema::table('list_items', function (Blueprint $table) {
            $table->dropColumn(['unit_id', 'notes']);
            $table->integer('quantity')->nullable(false)->change();
            $table->renameColumn('list_id', 'shopping_list_id');
        });

        Schema::rename('list_items', 'item');

        Schema::table('lists', function (Blueprint $table) {
            $table->dropColumn(['list_type', 'status']);
        });

        Schema::rename('lists', 'shopping_list');
    }
};
