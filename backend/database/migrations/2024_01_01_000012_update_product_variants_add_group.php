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
        Schema::table('product_variants', function (Blueprint $table) {
            $table->foreignId('variant_group_id')->nullable()->after('product_id')->constrained('product_variant_groups')->onDelete('cascade');
            $table->boolean('is_default')->default(false)->after('is_active');
            
            $table->index('variant_group_id', 'idx_variants_group');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropForeign(['variant_group_id']);
            $table->dropIndex('idx_variants_group');
            $table->dropColumn(['variant_group_id', 'is_default']);
        });
    }
};
