<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * This is a consolidated migration that creates all tables for Coffee St.
     * It includes the complete schema with all features:
     * - User management with order tracking
     * - Product catalog with variants and stock management
     * - Cart and order processing
     * - Inquiry/messaging system
     * - Notifications system
     * - Stock logging and audit trail
     */
    public function up(): void
    {
        // 1. Users Table
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 120);
            $table->string('last_name', 120);
            $table->string('email', 190)->unique();
            $table->boolean('is_admin')->default(false);
            $table->enum('status', ['active', 'restricted'])->default('active');
            $table->integer('failed_orders_count')->default(0);
            $table->timestamp('status_changed_at')->nullable();
            $table->string('password');
            $table->string('address')->nullable();
            $table->string('phone', 50)->nullable();
            $table->string('language_preference', 10)->default('en');
            $table->timestamps();
            $table->softDeletes();

            $table->index('email', 'idx_users_email');
        });

        // 2. Products Table (with stock management)
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('category', 50);
            $table->string('name', 160);
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->string('image_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_available')->default(true);

            // Stock management fields
            $table->integer('stock_quantity')->nullable();
            $table->boolean('track_stock')->default(false);
            $table->integer('low_stock_threshold')->default(5);
            $table->timestamp('stock_updated_at')->nullable();

            $table->string('unavailable_reason')->nullable();
            $table->timestamp('archived_at')->nullable();
            $table->timestamps();

            // Indexes for efficient queries
            $table->index('category', 'idx_products_category');
            $table->index('is_active', 'idx_products_is_active');
            $table->index('stock_quantity', 'idx_products_stock_quantity');
            $table->index('track_stock', 'idx_products_track_stock');
            $table->index(['track_stock', 'stock_quantity'], 'idx_products_track_stock_quantity');
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

        // 7. Cart Item Variants Table
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
            $table->enum('status', ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'failed', 'cancelled'])->default('pending');
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

            // Order tracking fields
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('preparing_at')->nullable();
            $table->timestamp('out_for_delivery_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('failed_at')->nullable();
            $table->string('failure_reason')->nullable();
            $table->string('delivery_proof_url')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('archived_at')->nullable();
            $table->foreignId('archived_by')->nullable()->constrained('users')->nullOnDelete();

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

        // 10. Order Item Variants Table
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

        // 13. Notifications Table
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->nullable()->constrained('products')->onDelete('cascade');
            $table->foreignId('inquiry_thread_id')->nullable()->constrained('inquiry_threads')->onDelete('cascade');
            $table->enum('type', ['low_stock', 'sold_out', 'stock_restored', 'new_inquiry']);
            $table->string('title');
            $table->text('message');
            $table->json('data')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index('type', 'idx_notifications_type');
            $table->index('is_read', 'idx_notifications_is_read');
            $table->index(['is_read', 'created_at'], 'idx_notifications_is_read_created_at');
        });

        // 14. Stock Logs Table
        Schema::create('stock_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->foreignId('admin_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('order_id')->nullable()->constrained('orders')->onDelete('set null');
            $table->integer('quantity_change');
            $table->integer('quantity_before');
            $table->integer('quantity_after');
            $table->enum('reason', ['sale', 'restock', 'adjustment', 'damaged', 'expired', 'returned', 'order_cancelled', 'order_failed']);
            $table->text('notes')->nullable();
            $table->timestamp('created_at');

            $table->index('product_id', 'idx_stock_logs_product_id');
            $table->index('created_at', 'idx_stock_logs_created_at');
            $table->index(['product_id', 'created_at'], 'idx_stock_logs_product_created');
        });

        // 15. Personal Access Tokens Table (Laravel Sanctum)
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->text('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->index('expires_at', 'idx_personal_access_tokens_expires_at');
        });

        // 16. Order Status Logs Table
        Schema::create('order_status_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('changed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->string('from_status')->nullable();
            $table->string('to_status');
            $table->text('notes')->nullable();
            $table->string('proof_url')->nullable();
            $table->timestamps();

            $table->index('order_id', 'idx_order_status_logs_order_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_status_logs');
        Schema::dropIfExists('personal_access_tokens');
        Schema::dropIfExists('stock_logs');
        Schema::dropIfExists('notifications');
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
        Schema::dropIfExists('users');
    }
};
