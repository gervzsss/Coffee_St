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
      $table->integer('stock_quantity')->nullable()->after('is_available');
      $table->boolean('track_stock')->default(false)->after('stock_quantity');
      $table->integer('low_stock_threshold')->default(5)->after('track_stock');
      $table->timestamp('stock_updated_at')->nullable()->after('low_stock_threshold');

      // Add index for stock queries
      $table->index(['track_stock', 'stock_quantity']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('products', function (Blueprint $table) {
      $table->dropIndex(['track_stock', 'stock_quantity']);
      $table->dropColumn([
        'stock_quantity',
        'track_stock',
        'low_stock_threshold',
        'stock_updated_at'
      ]);
    });
  }
};
