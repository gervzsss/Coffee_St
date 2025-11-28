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
        // Update orders table - change status enum and add new fields
        Schema::table('orders', function (Blueprint $table) {
            // Add new columns for order tracking
            $table->timestamp('confirmed_at')->nullable()->after('payment_method');
            $table->timestamp('preparing_at')->nullable()->after('confirmed_at');
            $table->timestamp('out_for_delivery_at')->nullable()->after('preparing_at');
            $table->timestamp('delivered_at')->nullable()->after('out_for_delivery_at');
            $table->timestamp('failed_at')->nullable()->after('delivered_at');
            $table->string('failure_reason')->nullable()->after('failed_at');
            $table->string('delivery_proof_url')->nullable()->after('failure_reason');
            $table->text('notes')->nullable()->after('delivery_proof_url');
        });

        // Modify status column - need to drop and recreate for enum change
        DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'failed', 'cancelled') DEFAULT 'pending'");

        // Create order_status_logs table for activity tracking
        Schema::create('order_status_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('changed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->string('from_status')->nullable();
            $table->string('to_status');
            $table->text('notes')->nullable();
            $table->string('proof_url')->nullable();
            $table->timestamps();

            $table->index('order_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_status_logs');

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'confirmed_at',
                'preparing_at',
                'out_for_delivery_at',
                'delivered_at',
                'failed_at',
                'failure_reason',
                'delivery_proof_url',
                'notes',
            ]);
        });

        DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending'");
    }
};
