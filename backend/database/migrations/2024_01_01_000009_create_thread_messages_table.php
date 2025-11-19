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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('thread_messages');
    }
};
