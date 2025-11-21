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
        Schema::table('cart_items', function (Blueprint $table) {
            // Add customization summary field
            $table->text('customization_summary')->nullable()->after('price_delta');
            
            // Keep variant_id and variant_name for backward compatibility
            // but they will be deprecated in favor of cart_item_variants table
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            $table->dropColumn('customization_summary');
        });
    }
};
