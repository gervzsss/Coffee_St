<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Creates the pos_shifts table for shift management and cash reconciliation.
     * Also adds pos_shift_id to the orders table to link POS orders to shifts.
     */
    public function up(): void
    {
        // Create pos_shifts table
        Schema::create('pos_shifts', function (Blueprint $table) {
            $table->id();
            $table->enum('status', ['active', 'closed'])->default('active');
            $table->timestamp('opened_at');
            $table->timestamp('closed_at')->nullable();
            $table->foreignId('opened_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('closed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->decimal('opening_cash_float', 10, 2);
            $table->decimal('actual_cash_count', 10, 2)->nullable();
            $table->decimal('expected_cash', 10, 2)->nullable();
            $table->decimal('variance', 10, 2)->nullable();
            $table->decimal('cash_sales_total', 10, 2)->nullable();
            $table->decimal('ewallet_sales_total', 10, 2)->nullable();
            $table->decimal('gross_sales_total', 10, 2)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            // Index for finding active shift quickly
            $table->index('status', 'idx_pos_shifts_status');
            $table->index(['status', 'opened_at'], 'idx_pos_shifts_status_opened');
        });

        // Add pos_shift_id to orders table
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('pos_shift_id')
                ->nullable()
                ->after('order_source')
                ->constrained('pos_shifts')
                ->onDelete('set null');

            $table->index('pos_shift_id', 'idx_orders_pos_shift');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['pos_shift_id']);
            $table->dropIndex('idx_orders_pos_shift');
            $table->dropColumn('pos_shift_id');
        });

        Schema::dropIfExists('pos_shifts');
    }
};
