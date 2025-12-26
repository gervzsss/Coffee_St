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
        // Update the enum to include new cancellation reasons
        DB::statement("ALTER TABLE stock_logs MODIFY COLUMN reason ENUM('sale', 'restock', 'adjustment', 'damaged', 'expired', 'returned', 'order_cancelled', 'order_failed')");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to original enum values
        DB::statement("ALTER TABLE stock_logs MODIFY COLUMN reason ENUM('sale', 'restock', 'adjustment', 'damaged', 'expired', 'returned')");
    }
};
