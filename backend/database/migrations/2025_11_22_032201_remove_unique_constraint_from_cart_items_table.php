<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            // Drop foreign keys that might be using the index
            $table->dropForeign(['cart_id']);
            $table->dropForeign(['product_id']);
        });
        
        // Drop the unique constraint
        DB::statement('ALTER TABLE cart_items DROP INDEX uniq_cart_product');
        
        Schema::table('cart_items', function (Blueprint $table) {
            // Recreate foreign keys
            $table->foreign('cart_id')->references('id')->on('carts')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            $table->unique(['cart_id', 'product_id'], 'uniq_cart_product');
        });
    }
};
