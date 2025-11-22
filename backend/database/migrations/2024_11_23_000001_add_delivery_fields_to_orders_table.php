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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('order_number', 20)->unique()->after('id');
            $table->text('delivery_address')->nullable()->after('total');
            $table->string('delivery_contact', 20)->nullable()->after('delivery_address');
            $table->text('delivery_instructions')->nullable()->after('delivery_contact');
            $table->enum('payment_method', ['cash', 'gcash'])->default('cash')->after('delivery_instructions');
            
            $table->index('order_number', 'idx_orders_order_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex('idx_orders_order_number');
            $table->dropColumn([
                'order_number',
                'delivery_address',
                'delivery_contact',
                'delivery_instructions',
                'payment_method',
            ]);
        });
    }
};
