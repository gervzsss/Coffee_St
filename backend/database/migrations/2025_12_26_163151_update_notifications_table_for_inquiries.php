<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            // Make product_id nullable since inquiry notifications won't have a product
            $table->foreignId('product_id')->nullable()->change();

            // Add inquiry_thread_id for inquiry notifications
            $table->foreignId('inquiry_thread_id')->nullable()->after('product_id')->constrained('inquiry_threads')->onDelete('cascade');
        });

        // Update the type enum to include new_inquiry
        DB::statement("ALTER TABLE notifications MODIFY COLUMN type ENUM('low_stock', 'sold_out', 'stock_restored', 'new_inquiry') NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropForeign(['inquiry_thread_id']);
            $table->dropColumn('inquiry_thread_id');
        });

        // Restore original type enum
        DB::statement("ALTER TABLE notifications MODIFY COLUMN type ENUM('low_stock', 'sold_out', 'stock_restored') NOT NULL");

        Schema::table('notifications', function (Blueprint $table) {
            // Make product_id non-nullable again
            $table->foreignId('product_id')->nullable(false)->change();
        });
    }
};
