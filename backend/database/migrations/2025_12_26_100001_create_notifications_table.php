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
    Schema::create('notifications', function (Blueprint $table) {
      $table->id();
      $table->foreignId('product_id')->constrained()->onDelete('cascade');
      $table->enum('type', ['low_stock', 'sold_out', 'stock_restored'])->index();
      $table->string('title');
      $table->text('message');
      $table->json('data')->nullable(); // Additional metadata
      $table->boolean('is_read')->default(false)->index();
      $table->timestamp('read_at')->nullable();
      $table->timestamps();

      // Composite index for fetching unread notifications
      $table->index(['is_read', 'created_at']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('notifications');
  }
};
