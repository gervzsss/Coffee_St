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
    Schema::create('stock_logs', function (Blueprint $table) {
      $table->id();
      $table->foreignId('product_id')->constrained()->onDelete('cascade');
      $table->foreignId('admin_user_id')->nullable()->constrained('users')->onDelete('set null');
      $table->foreignId('order_id')->nullable()->constrained()->onDelete('set null');
      $table->integer('quantity_change'); // Can be negative or positive
      $table->integer('quantity_before');
      $table->integer('quantity_after');
      $table->enum('reason', ['sale', 'restock', 'adjustment', 'damaged', 'expired', 'returned']);
      $table->text('notes')->nullable();
      $table->timestamp('created_at');

      // Add indexes for common queries
      $table->index('product_id');
      $table->index('created_at');
      $table->index(['product_id', 'created_at']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('stock_logs');
  }
};
