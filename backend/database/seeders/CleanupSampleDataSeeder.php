<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemVariant;
use App\Models\OrderStatusLog;
use App\Models\InquiryThread;
use App\Models\ThreadMessage;
use Illuminate\Support\Facades\DB;

class CleanupSampleDataSeeder extends Seeder
{
  /**
   * Remove all sample data from the database.
   */
  public function run(): void
  {
    $this->command->info('🧹 Starting cleanup of sample data...');

    // Get sample user emails
    $sampleEmails = [
      'maria.santos@gmail.com',
      'juan.delacruz@yahoo.com',
      'sofia.reyes@outlook.com',
      'carlos.mendoza@gmail.com',
      'bella.torres@gmail.com',
      'miguel.ramos@yahoo.com',
      'ana.garcia@gmail.com',
      'diego.fernandez@outlook.com',
      'lucia.martinez@gmail.com',
      'ricardo.alvarez@yahoo.com',
      'carmen.lopez@gmail.com',
      'antonio.cruz@outlook.com',
    ];

    // Find sample users (including soft-deleted ones)
    $sampleUsers = User::withTrashed()->whereIn('email', $sampleEmails)->pluck('id');

    if ($sampleUsers->isEmpty()) {
      $this->command->warn('⚠️  No sample data found to clean up.');
      return;
    }

    $this->command->info('Found ' . $sampleUsers->count() . ' sample users to remove...');

    // Delete in order to maintain referential integrity
    DB::transaction(function () use ($sampleUsers) {
      // Get all orders from sample users
      $orderIds = Order::whereIn('user_id', $sampleUsers)->pluck('id');

      if ($orderIds->isNotEmpty()) {
        $this->command->info('   Removing order item variants...');
        $orderItemIds = OrderItem::whereIn('order_id', $orderIds)->pluck('id');
        OrderItemVariant::whereIn('order_item_id', $orderItemIds)->delete();

        $this->command->info('   Removing order items...');
        OrderItem::whereIn('order_id', $orderIds)->delete();

        $this->command->info('   Removing order status logs...');
        OrderStatusLog::whereIn('order_id', $orderIds)->delete();

        $this->command->info('   Removing orders...');
        Order::whereIn('id', $orderIds)->delete();
      }

      // Get all inquiry threads from sample users
      $threadIds = InquiryThread::whereIn('user_id', $sampleUsers)->pluck('id');

      if ($threadIds->isNotEmpty()) {
        $this->command->info('   Removing thread messages...');
        ThreadMessage::whereIn('thread_id', $threadIds)->delete();

        $this->command->info('   Removing inquiry threads...');
        InquiryThread::whereIn('id', $threadIds)->delete();
      }

      // Delete sample users (force delete to bypass soft deletes)
      $this->command->info('   Removing sample users...');
      User::whereIn('id', $sampleUsers)->forceDelete();
    });

    $this->command->info('✅ Sample data cleanup completed successfully!');
    $this->command->info('💡 You can now run SampleDataSeeder again to regenerate fresh sample data.');
  }
}
