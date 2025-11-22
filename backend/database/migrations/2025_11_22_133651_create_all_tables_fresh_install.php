<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * This migration creates all tables for a fresh installation of Coffee St.
     * It consolidates all previous migrations into a single, clean schema.
     */
    public function up(): void
    {
        // 1. Users Table
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 120);
            $table->string('last_name', 120);
            $table->string('email', 190)->unique();
            $table->string('password');
            $table->string('address')->nullable();
            $table->string('phone', 50)->nullable();
            $table->string('language_preference', 10)->default('en');
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('email', 'idx_users_email');
        });

        // 2. Products Table
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('category', 50);
            $table->string('name', 160);
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->string('image_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('category', 'idx_products_category');
            $table->index('is_active', 'idx_products_is_active');
        });

        // 3. Product Variant Groups Table
        Schema::create('product_variant_groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('name', 120);
            $table->text('description')->nullable();
            $table->enum('selection_type', ['single', 'multiple'])->default('single');
            $table->boolean('is_required')->default(false);
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('product_id', 'idx_variant_groups_product');
            $table->index(['product_id', 'is_active'], 'idx_variant_groups_active');
        });

        // 4. Product Variants Table
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->foreignId('variant_group_id')->nullable()->constrained('product_variant_groups')->onDelete('cascade');
            $table->string('group_name', 120);
            $table->string('name', 120);
            $table->decimal('price_delta', 10, 2)->default(0.00);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            $table->index('product_id', 'idx_variants_product');
            $table->index('variant_group_id', 'idx_variants_group');
        });

        // 5. Carts Table
        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['active', 'converted', 'abandoned'])->default('active');
            $table->timestamps();

            $table->index(['user_id', 'status'], 'idx_carts_user_status');
        });

        // 6. Cart Items Table
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_id')->constrained('carts')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('restrict');
            $table->foreignId('variant_id')->nullable()->constrained('product_variants')->onDelete('set null');
            $table->string('variant_name')->nullable();
            $table->unsignedInteger('quantity')->default(1);
            $table->decimal('unit_price', 10, 2);
            $table->decimal('price_delta', 10, 2)->default(0.00);
            $table->text('customization_summary')->nullable();
            $table->timestamps();
        });

        // 7. Cart Item Variants Table (for multi-customization support)
        Schema::create('cart_item_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_item_id')->constrained('cart_items')->onDelete('cascade');
            $table->foreignId('variant_id')->constrained('product_variants')->onDelete('cascade');
            $table->string('variant_group_name', 120);
            $table->string('variant_name', 120);
            $table->decimal('price_delta', 10, 2)->default(0.00);
            $table->timestamps();

            $table->index('cart_item_id', 'idx_cart_item_variants_cart_item');
            $table->index('variant_id', 'idx_cart_item_variants_variant');
        });

        // 8. Orders Table
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number', 20)->unique();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['pending', 'paid', 'cancelled'])->default('pending');
            $table->decimal('subtotal', 10, 2)->default(0.00);
            $table->decimal('delivery_fee', 10, 2)->default(0.00);
            $table->decimal('tax_rate', 6, 4)->default(0.0800);
            $table->decimal('tax_amount', 10, 2)->default(0.00);
            $table->decimal('tax', 10, 2)->default(0.00);
            $table->decimal('total', 10, 2)->default(0.00);
            $table->text('delivery_address')->nullable();
            $table->string('delivery_contact', 20)->nullable();
            $table->text('delivery_instructions')->nullable();
            $table->enum('payment_method', ['cash', 'gcash'])->default('cash');
            $table->timestamps();

            $table->index(['user_id', 'status'], 'idx_orders_user_status');
            $table->index('order_number', 'idx_orders_order_number');
        });

        // 9. Order Items Table
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('restrict');
            $table->foreignId('variant_id')->nullable()->constrained('product_variants')->onDelete('set null');
            $table->string('variant_name')->nullable();
            $table->decimal('price_delta', 10, 2)->default(0.00);
            $table->string('product_name');
            $table->decimal('unit_price', 10, 2);
            $table->unsignedInteger('quantity')->default(1);
            $table->decimal('line_total', 10, 2);
            $table->text('customization_summary')->nullable();
            $table->timestamps();

            $table->index('order_id', 'idx_order_items_order');
        });

        // 10. Order Item Variants Table (for multi-customization support)
        Schema::create('order_item_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_item_id')->constrained('order_items')->onDelete('cascade');
            $table->foreignId('variant_id')->nullable()->constrained('product_variants')->onDelete('set null');
            $table->string('variant_group_name', 120);
            $table->string('variant_name', 120);
            $table->decimal('price_delta', 10, 2)->default(0.00);
            $table->timestamps();

            $table->index('order_item_id', 'idx_order_item_variants_order_item');
        });

        // 11. Inquiry Threads Table
        Schema::create('inquiry_threads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('guest_email', 190)->nullable();
            $table->string('guest_name', 190)->nullable();
            $table->string('subject');
            $table->enum('status', ['pending', 'responded', 'done'])->default('pending');
            $table->timestamps();
            $table->timestamp('last_message_at')->useCurrent();
            $table->timestamp('admin_last_viewed_at')->nullable();

            $table->index(['user_id', 'subject'], 'idx_threads_user_subject');
            $table->index(['guest_email', 'subject'], 'idx_threads_guest_subject');
            $table->index(['status', 'last_message_at'], 'idx_threads_status_last_message');
        });

        // 12. Thread Messages Table
        Schema::create('thread_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('thread_id')->constrained('inquiry_threads')->onDelete('cascade');
            $table->enum('sender_type', ['user', 'guest', 'admin']);
            $table->foreignId('sender_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('sender_name', 190)->nullable();
            $table->string('sender_email', 190)->nullable();
            $table->text('message');
            $table->timestamp('created_at')->useCurrent();

            $table->index(['thread_id', 'created_at'], 'idx_thread_messages_thread_created');
        });

        // 13. Personal Access Tokens Table (Laravel Sanctum)
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->text('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->index('expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('thread_messages');
        Schema::dropIfExists('inquiry_threads');
        Schema::dropIfExists('order_item_variants');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('cart_item_variants');
        Schema::dropIfExists('cart_items');
        Schema::dropIfExists('carts');
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('product_variant_groups');
        Schema::dropIfExists('products');
        Schema::dropIfExists('personal_access_tokens');
        Schema::dropIfExists('users');
    }
};
