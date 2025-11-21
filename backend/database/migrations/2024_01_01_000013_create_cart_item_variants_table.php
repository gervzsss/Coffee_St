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
        Schema::create('cart_item_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_item_id')->constrained()->onDelete('cascade');
            $table->foreignId('variant_id')->constrained('product_variants')->onDelete('cascade');
            $table->string('variant_group_name', 120);
            $table->string('variant_name', 120);
            $table->decimal('price_delta', 10, 2)->default(0.00);
            $table->timestamps();
            
            $table->index('cart_item_id', 'idx_cart_item_variants_cart_item');
            $table->index('variant_id', 'idx_cart_item_variants_variant');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_item_variants');
    }
};
