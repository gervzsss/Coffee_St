<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Add index on stock_quantity for filtering low stock/sold out products
            $table->index('stock_quantity', 'products_stock_quantity_index');

            // Add index on track_stock for filtering tracked vs untracked products
            $table->index('track_stock', 'products_track_stock_index');

            // Add composite index for efficient stock queries (track_stock + stock_quantity)
            $table->index(['track_stock', 'stock_quantity'], 'products_track_stock_quantity_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Drop indexes in reverse order
            $table->dropIndex('products_track_stock_quantity_index');
            $table->dropIndex('products_track_stock_index');
            $table->dropIndex('products_stock_quantity_index');
        });
    }
};
