<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Adds POS (Point of Sale) support fields to the orders table:
     * - order_source: distinguishes between online and in-store orders
     * - pos_customer_name: optional customer name for walk-in orders
     * - pos_customer_phone: optional customer phone for walk-in orders
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Order source: 'online' for website orders, 'pos' for in-store orders
            $table->enum('order_source', ['online', 'pos'])->default('online')->after('order_number');

            // Optional POS customer info (for walk-in customers without accounts)
            $table->string('pos_customer_name', 120)->nullable()->after('delivery_instructions');
            $table->string('pos_customer_phone', 50)->nullable()->after('pos_customer_name');

            // Index for efficient filtering by source and status
            $table->index(['order_source', 'status'], 'idx_orders_source_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex('idx_orders_source_status');
            $table->dropColumn(['order_source', 'pos_customer_name', 'pos_customer_phone']);
        });
    }
};
