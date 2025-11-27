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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('status', ['active', 'restricted'])->default('active')->after('is_admin');
            $table->integer('failed_orders_count')->default(0)->after('status');
            $table->timestamp('status_changed_at')->nullable()->after('failed_orders_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['status', 'failed_orders_count', 'status_changed_at']);
        });
    }
};
