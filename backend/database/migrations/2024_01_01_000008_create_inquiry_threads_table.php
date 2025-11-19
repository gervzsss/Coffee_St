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
        Schema::create('inquiry_threads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inquiry_threads');
    }
};
