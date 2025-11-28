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
      $table->boolean('is_available')->default(true)->after('is_active');
      $table->string('unavailable_reason')->nullable()->after('is_available');
      $table->timestamp('archived_at')->nullable()->after('unavailable_reason');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('products', function (Blueprint $table) {
      $table->dropColumn(['is_available', 'unavailable_reason', 'archived_at']);
    });
  }
};
