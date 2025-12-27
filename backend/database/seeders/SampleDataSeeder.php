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
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ProductVariantGroup;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class SampleDataSeeder extends Seeder
{
  private $users = [];
  private $products = [];
  private $variants = [];
  private $adminUser = null;
  private $orderCounter = 1;

  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    $this->command->info('🌱 Starting sample data seeding...');

    // Check if sample data already exists
    if (User::where('email', 'like', '%@gmail.com')->where('email', 'maria.santos@gmail.com')->exists()) {
      $this->command->warn('⚠️  Sample data already exists. Skipping...');
      $this->command->info('💡 Run CleanupSampleDataSeeder first to remove existing sample data.');
      return;
    }

    $this->loadProducts();
    $this->createAdminUser();
    $this->createUsers();
    $this->createOrders();
    $this->createInquiries();

    $this->command->info('✅ Sample data seeded successfully!');
    $this->command->info('📊 Summary:');
    $this->command->info('   - Users created: ' . count($this->users));
    $this->command->info('   - Orders created: ' . ($this->orderCounter - 1));
    $this->command->info('   - Test password: Password123!');
  }

  /**
   * Load existing products and variants
   */
  private function loadProducts(): void
  {
    $this->command->info('📦 Loading products and variants...');

    $this->products = Product::with('variantGroups.variants')->get();

    if ($this->products->isEmpty()) {
      $this->command->error('❌ No products found! Please run ProductSeeder first.');
      exit(1);
    }

    $this->command->info('   ✓ Loaded ' . $this->products->count() . ' products');
  }

  /**
   * Create admin user for inquiry replies
   */
  private function createAdminUser(): void
  {
    $this->adminUser = User::firstOrCreate(
      ['email' => 'admin@coffeestreet.com'],
      [
        'first_name' => 'Coffee Street',
        'last_name' => 'Admin',
        'phone' => '+639171234500',
        'password' => Hash::make('Admin123!'),
        'is_admin' => true,
        'created_at' => Carbon::now()->subMonths(12),
      ]
    );

    $this->command->info('👤 Admin user ready');
  }

  /**
   * Create 12 sample users
   */
  private function createUsers(): void
  {
    $this->command->info('👥 Creating sample users...');

    $userData = [
      ['first_name' => 'Maria', 'last_name' => 'Santos', 'email' => 'maria.santos@gmail.com', 'phone' => '+639171234567', 'months_ago' => 6],
      ['first_name' => 'Juan', 'last_name' => 'Dela Cruz', 'email' => 'juan.delacruz@yahoo.com', 'phone' => '+639281234568', 'months_ago' => 5],
      ['first_name' => 'Sofia', 'last_name' => 'Reyes', 'email' => 'sofia.reyes@outlook.com', 'phone' => '+639171234569', 'months_ago' => 4],
      ['first_name' => 'Carlos', 'last_name' => 'Mendoza', 'email' => 'carlos.mendoza@gmail.com', 'phone' => '+639281234570', 'months_ago' => 4],
      ['first_name' => 'Isabella', 'last_name' => 'Torres', 'email' => 'bella.torres@gmail.com', 'phone' => '+639171234571', 'months_ago' => 3],
      ['first_name' => 'Miguel', 'last_name' => 'Ramos', 'email' => 'miguel.ramos@yahoo.com', 'phone' => '+639281234572', 'months_ago' => 3],
      ['first_name' => 'Ana', 'last_name' => 'Garcia', 'email' => 'ana.garcia@gmail.com', 'phone' => '+639171234573', 'months_ago' => 2],
      ['first_name' => 'Diego', 'last_name' => 'Fernandez', 'email' => 'diego.fernandez@outlook.com', 'phone' => '+639281234574', 'months_ago' => 2],
      ['first_name' => 'Lucia', 'last_name' => 'Martinez', 'email' => 'lucia.martinez@gmail.com', 'phone' => '+639171234575', 'months_ago' => 0.5],
      ['first_name' => 'Ricardo', 'last_name' => 'Alvarez', 'email' => 'ricardo.alvarez@yahoo.com', 'phone' => '+639281234576', 'months_ago' => 0.25],
      ['first_name' => 'Carmen', 'last_name' => 'Lopez', 'email' => 'carmen.lopez@gmail.com', 'phone' => '+639171234577', 'months_ago' => 1],
      ['first_name' => 'Antonio', 'last_name' => 'Cruz', 'email' => 'antonio.cruz@outlook.com', 'phone' => '+639281234578', 'months_ago' => 0.75],
    ];

    foreach ($userData as $data) {
      $user = User::create([
        'first_name' => $data['first_name'],
        'last_name' => $data['last_name'],
        'email' => $data['email'],
        'phone' => $data['phone'],
        'password' => Hash::make('Password123!'),
        'created_at' => Carbon::now()->subMonths($data['months_ago']),
        'updated_at' => Carbon::now()->subMonths($data['months_ago']),
      ]);

      $this->users[] = $user;
    }

    $this->command->info('   ✓ Created ' . count($this->users) . ' users');
  }

  /**
   * Create orders for all users
   */
  private function createOrders(): void
  {
    $this->command->info('📝 Creating orders...');

    // Order count per user based on their profile
    $orderCounts = [
      18, // Maria Santos - Regular
      15, // Juan Dela Cruz - Regular
      12, // Sofia Reyes - Regular
      10, // Carlos Mendoza - Regular
      8,  // Isabella Torres - Regular
      5,  // Miguel Ramos - Occasional
      4,  // Ana Garcia - Occasional
      3,  // Diego Fernandez - Occasional
      2,  // Lucia Martinez - New
      1,  // Ricardo Alvarez - New
      4,  // Carmen Lopez - Problem (2 cancelled, 1 failed, 1 completed)
      3,  // Antonio Cruz - Problem (1 cancelled, 2 completed)
    ];

    foreach ($this->users as $index => $user) {
      $count = $orderCounts[$index];
      $this->createOrdersForUser($user, $count, $index);
    }

    $this->command->info('   ✓ Created ' . ($this->orderCounter - 1) . ' orders');
  }

  /**
   * Create orders for a specific user
   */
  private function createOrdersForUser(User $user, int $count, int $userIndex): void
  {
    $userAge = Carbon::parse($user->created_at);

    for ($i = 0; $i < $count; $i++) {
      // Determine order status based on distribution
      $statusRoll = rand(1, 100);

      if ($i < 2 && in_array($userIndex, [10, 11])) {
        // Problem customers get cancelled/failed orders first
        $status = $i == 0 ? 'cancelled' : ($userIndex == 10 ? 'failed' : 'completed');
      } elseif ($i == 0 && $userIndex >= 8) {
        // New customers get recent processing/pending orders
        $status = rand(0, 1) ? 'processing' : 'pending';
      } elseif ($statusRoll <= 60) {
        $status = 'completed';
      } elseif ($statusRoll <= 75) {
        $status = 'processing';
      } elseif ($statusRoll <= 85) {
        $status = 'pending';
      } elseif ($statusRoll <= 95) {
        $status = 'cancelled';
      } else {
        $status = 'failed';
      }

      // Generate realistic order date
      $orderDate = $this->generateOrderDate($status, $userAge);

      // Create the order
      $this->createOrderByStatus($user, $status, $orderDate);
    }
  }

  /**
   * Generate realistic order date based on status
   */
  private function generateOrderDate(string $status, Carbon $userAge): Carbon
  {
    $now = Carbon::now();

    switch ($status) {
      case 'processing':
        // Within last 6 hours
        return $now->copy()->subHours(rand(1, 6));

      case 'pending':
        // Within last 2 hours
        return $now->copy()->subHours(rand(0, 2));

      case 'completed':
        // 1 day to user age
        $daysAgo = rand(1, max(1, $now->diffInDays($userAge)));
        $date = $now->copy()->subDays($daysAgo);
        break;

      case 'cancelled':
      case 'failed':
        // 1 week to 2 months ago
        $daysAgo = rand(7, 60);
        $date = $now->copy()->subDays($daysAgo);
        break;

      default:
        $date = $now->copy()->subDays(rand(1, 30));
    }

    // Apply realistic time (avoid closed hours)
    return $this->applyRealisticTime($date);
  }

  /**
   * Apply realistic business hours to timestamp
   */
  private function applyRealisticTime(Carbon $date): Carbon
  {
    // Peak hours: 7-9 AM, 12-2 PM, 5-7 PM (40%)
    // Regular hours: 9 AM-5 PM (50%)
    // Late hours: 7-9 PM (10%)

    $timeRoll = rand(1, 100);

    if ($timeRoll <= 40) {
      // Peak hours
      $periods = [[7, 9], [12, 14], [17, 19]];
      $period = $periods[array_rand($periods)];
      $hour = rand($period[0], $period[1]);
    } elseif ($timeRoll <= 90) {
      // Regular hours
      $hour = rand(9, 17);
    } else {
      // Late hours
      $hour = rand(19, 21);
    }

    $minute = rand(0, 59);

    return $date->setTime($hour, $minute, rand(0, 59));
  }

  /**
   * Create order based on status
   */
  private function createOrderByStatus(User $user, string $status, Carbon $orderDate): void
  {
    // Generate order items
    $items = $this->generateOrderItems();
    $totalAmount = $this->calculateOrderTotal($items);

    // Determine payment details
    $paymentStatus = match ($status) {
      'completed', 'processing' => 'paid',
      'pending' => rand(0, 1) ? 'paid' : 'pending',
      'cancelled' => rand(0, 1) ? 'refunded' : 'cancelled',
      'failed' => 'failed',
      default => 'pending'
    };

    $paymentMethod = $this->getRandomPaymentMethod();

    // Map status to match database enum
    $dbStatus = match ($status) {
      'completed' => 'delivered',
      'processing' => 'preparing',
      default => $status
    };

    // Create order
    $order = Order::create([
      'user_id' => $user->id,
      'order_number' => 'ORD-' . $orderDate->format('Ymd') . '-' . str_pad($this->orderCounter++, 4, '0', STR_PAD_LEFT),
      'subtotal' => $totalAmount,
      'total' => $totalAmount,
      'status' => $dbStatus,
      'payment_method' => $paymentMethod,
      'notes' => $this->getOrderNotes($status),
      'created_at' => $orderDate,
      'updated_at' => $orderDate,
    ]);

    // Create order items
    foreach ($items as $item) {
      $unitPrice = $item['price'];
      $lineTotal = $unitPrice * $item['quantity'] + array_sum(array_column($item['variants'], 'price_delta')) * $item['quantity'];

      $orderItem = OrderItem::create([
        'order_id' => $order->id,
        'product_id' => $item['product_id'],
        'product_name' => $item['product_name'],
        'quantity' => $item['quantity'],
        'unit_price' => $unitPrice,
        'line_total' => $lineTotal,
        'created_at' => $orderDate,
        'updated_at' => $orderDate,
      ]);

      // Add variants
      foreach ($item['variants'] as $variant) {
        OrderItemVariant::create([
          'order_item_id' => $orderItem->id,
          'variant_id' => $variant['id'],
          'variant_group_name' => $variant['group_name'],
          'variant_name' => $variant['name'],
          'price_delta' => $variant['price_delta'],
        ]);
      }
    }

    // Create status logs
    $this->createStatusLogs($order, $status, $orderDate);
  }

  /**
   * Generate random order items
   */
  private function generateOrderItems(): array
  {
    $itemCount = rand(1, 5);
    $items = [];

    for ($i = 0; $i < $itemCount; $i++) {
      $product = $this->products->random();
      $quantity = rand(1, 3);
      $variants = $this->getRandomVariantsForProduct($product);

      $items[] = [
        'product_id' => $product->id,
        'product_name' => $product->name,
        'quantity' => $quantity,
        'price' => $product->price,
        'variants' => $variants,
      ];
    }

    return $items;
  }

  /**
   * Get random variants for a product
   */
  private function getRandomVariantsForProduct(Product $product): array
  {
    $variants = [];

    foreach ($product->variantGroups as $group) {
      if ($group->is_required || rand(0, 100) > 50) {
        if ($group->selection_type === 'single') {
          $variant = $group->variants->random();
          $variants[] = [
            'id' => $variant->id,
            'group_name' => $group->name,
            'name' => $variant->name,
            'price_delta' => $variant->price_delta,
          ];
        } else {
          // Multiple selection - randomly select 0-2 variants
          $count = rand(0, min(2, $group->variants->count()));
          $selectedVariants = $group->variants->random($count);
          foreach ($selectedVariants as $variant) {
            $variants[] = [
              'id' => $variant->id,
              'group_name' => $group->name,
              'name' => $variant->name,
              'price_delta' => $variant->price_delta,
            ];
          }
        }
      }
    }

    return $variants;
  }

  /**
   * Calculate order total including variants
   */
  private function calculateOrderTotal(array $items): float
  {
    $total = 0;

    foreach ($items as $item) {
      $itemTotal = $item['price'] * $item['quantity'];

      foreach ($item['variants'] as $variant) {
        $itemTotal += $variant['price_delta'] * $item['quantity'];
      }

      $total += $itemTotal;
    }

    return round($total, 2);
  }

  /**
   * Get random payment method
   */
  private function getRandomPaymentMethod(): string
  {
    $roll = rand(1, 100);

    // Only cash and gcash are supported in the database schema
    if ($roll <= 60)
      return 'cash';
    return 'gcash';
  }

  /**
   * Get order notes based on status
   */
  private function getOrderNotes(string $status): ?string
  {
    return match ($status) {
      'cancelled' => collect([
        'Customer requested cancellation',
        'Changed mind about order',
        'Order placed by mistake',
        'Found better pricing elsewhere',
      ])->random(),
      'failed' => collect([
        'Payment gateway timeout',
        'Insufficient stock at time of order',
        'Payment verification failed',
        'Card declined',
      ])->random(),
      default => null
    };
  }

  /**
   * Create status logs for order
   */
  private function createStatusLogs(Order $order, string $finalStatus, Carbon $orderDate): void
  {
    $statuses = match ($finalStatus) {
      'completed' => ['pending', 'processing', 'completed'],
      'processing' => ['pending', 'processing'],
      'pending' => ['pending'],
      'cancelled' => ['pending', 'cancelled'],
      'failed' => ['pending', 'failed'],
      default => ['pending']
    };

    $currentTime = $orderDate->copy();
    $previousStatus = null;

    foreach ($statuses as $status) {
      OrderStatusLog::create([
        'order_id' => $order->id,
        'from_status' => $previousStatus,
        'to_status' => $status,
        'notes' => $this->getStatusLogNotes($status),
        'created_at' => $currentTime,
        'updated_at' => $currentTime,
      ]);

      $previousStatus = $status;

      // Add realistic time gaps between status changes
      if ($status !== $finalStatus) {
        $currentTime = $currentTime->addMinutes(rand(5, 30));
      }
    }
  }

  /**
   * Get status log notes
   */
  private function getStatusLogNotes(string $status): ?string
  {
    return match ($status) {
      'pending' => 'Order received and awaiting confirmation',
      'processing' => 'Order is being prepared',
      'completed' => 'Order completed and ready for pickup',
      'cancelled' => 'Order has been cancelled',
      'failed' => 'Order failed due to payment or stock issues',
      default => null
    };
  }

  /**
   * Create inquiry threads
   */
  private function createInquiries(): void
  {
    $this->command->info('💬 Creating inquiry threads...');

    $inquiries = [
      // Product Inquiries (30%)
      ['type' => 'product', 'subject' => 'Sugar-free options?', 'status' => 'done'],
      ['type' => 'product', 'subject' => 'Difference between Spanish Latte and Cappuccino', 'status' => 'done'],
      ['type' => 'product', 'subject' => 'Can I customize sweetness level?', 'status' => 'done'],
      ['type' => 'product', 'subject' => 'Dairy-free milk alternatives', 'status' => 'done'],
      ['type' => 'product', 'subject' => 'Are there vegan pastries?', 'status' => 'done'],
      ['type' => 'product', 'subject' => 'Caffeine content in matcha', 'status' => 'done'],

      // Order Issues (25%)
      ['type' => 'order', 'subject' => 'My order is taking too long', 'status' => 'done'],
      ['type' => 'order', 'subject' => 'Wrong item received', 'status' => 'done'],
      ['type' => 'order', 'subject' => 'Missing add-ons in my order', 'status' => 'done'],
      ['type' => 'order', 'subject' => 'Order cancelled without notice', 'status' => 'responded'],
      ['type' => 'order', 'subject' => 'Incorrect total amount charged', 'status' => 'done'],

      // General Inquiries (20%)
      ['type' => 'general', 'subject' => 'Operating hours?', 'status' => 'done'],
      ['type' => 'general', 'subject' => 'Do you offer delivery?', 'status' => 'done'],
      ['type' => 'general', 'subject' => 'Can I pre-order for tomorrow?', 'status' => 'done'],
      ['type' => 'general', 'subject' => 'Loyalty rewards program?', 'status' => 'pending'],

      // Feedback (15%)
      ['type' => 'feedback', 'subject' => 'Excellent coffee!', 'status' => 'done'],
      ['type' => 'feedback', 'subject' => 'Fresh pastries', 'status' => 'done'],
      ['type' => 'feedback', 'subject' => 'Service was slow', 'status' => 'done'],
      ['type' => 'feedback', 'subject' => 'Love the Ube Frappe!', 'status' => 'done'],

      // Account Issues (10%)
      ['type' => 'account', 'subject' => 'Cannot reset password', 'status' => 'done'],
      ['type' => 'account', 'subject' => 'Update phone number', 'status' => 'done'],
      ['type' => 'account', 'subject' => 'Delete account request', 'status' => 'responded'],
    ];

    foreach ($inquiries as $inquiryData) {
      $user = $this->users[array_rand($this->users)];
      $this->createInquiryThread($user, $inquiryData);
    }

    $this->command->info('   ✓ Created ' . count($inquiries) . ' inquiry threads');
  }

  /**
   * Create inquiry thread with messages
   */
  private function createInquiryThread(User $user, array $data): void
  {
    $createdAt = Carbon::now()->subDays(rand(1, 60))->setTime(rand(8, 20), rand(0, 59));

    $thread = InquiryThread::create([
      'user_id' => $user->id,
      'subject' => $data['subject'],
      'status' => $data['status'],
      'created_at' => $createdAt,
      'updated_at' => $createdAt,
    ]);

    // Customer message
    $customerMessage = $this->generateCustomerMessage($data['type'], $data['subject']);
    ThreadMessage::create([
      'thread_id' => $thread->id,
      'sender_type' => 'user',
      'sender_id' => $user->id,
      'sender_name' => $user->first_name . ' ' . $user->last_name,
      'sender_email' => $user->email,
      'message' => $customerMessage,
      'created_at' => $createdAt,
    ]);

    // Admin reply (if not pending status)
    if ($data['status'] !== 'pending') {
      $replyTime = $createdAt->copy()->addHours(rand(2, 24));
      $adminMessage = $this->generateAdminReply($data['type'], $data['subject']);

      ThreadMessage::create([
        'thread_id' => $thread->id,
        'sender_type' => 'admin',
        'sender_id' => $this->adminUser->id,
        'sender_name' => $this->adminUser->first_name . ' ' . $this->adminUser->last_name,
        'sender_email' => $this->adminUser->email,
        'message' => $adminMessage,
        'created_at' => $replyTime,
      ]);

      // Update thread timestamp
      $thread->update(['updated_at' => $replyTime]);
    }
  }

  /**
   * Generate customer message based on type
   */
  private function generateCustomerMessage(string $type, string $subject): string
  {
    $messages = [
      'product' => [
        'Sugar-free options?' => "Hi! I'm diabetic and wondering if you have sugar-free options for your drinks? Thanks!",
        'Difference between Spanish Latte and Cappuccino' => "What's the difference between Spanish Latte and Cappuccino? I'm trying to decide which one to order.",
        'Can I customize sweetness level?' => "Can I request less sugar in my drink? I prefer it not too sweet.",
        'Dairy-free milk alternatives' => "I'm lactose intolerant. Do you offer dairy-free milk alternatives?",
        'Are there vegan pastries?' => "Do you have any vegan pastry options? I'd love to try them with my coffee.",
        'Caffeine content in matcha' => "How much caffeine is in your matcha drinks compared to coffee?",
      ],
      'order' => [
        'My order is taking too long' => "I placed my order 45 minutes ago and it's still not ready. What's going on?",
        'Wrong item received' => "I received the wrong item in my order. I ordered Americano but got Cappuccino instead.",
        'Missing add-ons in my order' => "My order was missing the extra shot and whipped cream that I paid for.",
        'Order cancelled without notice' => "Why was my order cancelled? I didn't receive any notification about this.",
        'Incorrect total amount charged' => "I was charged ₱250 but my order total should only be ₱180. Please check.",
      ],
      'general' => [
        'Operating hours?' => "What are your operating hours? Are you open on weekends?",
        'Do you offer delivery?' => "Do you have delivery service? I'd like to order from home.",
        'Can I pre-order for tomorrow?' => "Is it possible to place an order for tomorrow morning? I need it by 8 AM.",
        'Loyalty rewards program?' => "Do you have a loyalty or rewards program for regular customers?",
      ],
      'feedback' => [
        'Excellent coffee!' => "Just wanted to say the coffee here is excellent! Best Americano I've had in a while.",
        'Fresh pastries' => "The cinnamon rolls are amazing! So fresh and delicious. Keep up the great work!",
        'Service was slow' => "The coffee is great but the service was quite slow today. Hope you can improve wait times.",
        'Love the Ube Frappe!' => "The Ube Frappe is incredible! Love the Filipino twist on the menu. Please don't remove it!",
      ],
      'account' => [
        'Cannot reset password' => "I'm trying to reset my password but not receiving the email. Can you help?",
        'Update phone number' => "How do I update my phone number in my account? Can't find the option in settings.",
        'Delete account request' => "I'd like to delete my account and all my data. How do I proceed with this?",
      ],
    ];

    return $messages[$type][$subject] ?? "I have a question about: {$subject}";
  }

  /**
   * Generate admin reply based on type
   */
  private function generateAdminReply(string $type, string $subject): string
  {
    $replies = [
      'product' => [
        'Sugar-free options?' => "Thank you for reaching out! While we don't currently have sugar-free syrups, you can customize the sweetness level from 0% to 100% at no extra charge. For zero sugar, simply select 0% sweetness when ordering. We're also looking into sugar-free alternatives for future menu additions!",
        'Difference between Spanish Latte and Cappuccino' => "Great question! Spanish Latte uses sweetened condensed milk which gives it a richer, sweeter taste and creamier texture. Cappuccino uses equal parts espresso, steamed milk, and foam with a lighter, more balanced flavor. Spanish Latte is perfect if you prefer sweeter drinks, while Cappuccino is ideal for those who enjoy the bold espresso taste. Hope this helps!",
        'Can I customize sweetness level?' => "Absolutely! You can customize the sweetness level from 0% to 100% at no extra charge. Just let us know your preference when ordering. We want your drink to be perfect for you!",
        'Dairy-free milk alternatives' => "Yes, we offer several dairy-free alternatives! We have Oat, Almond, Soy, and Coconut milk available for all our coffee drinks at an additional ₱15-20. All are delicious options and our staff can help you choose the best one for your taste preferences.",
        'Are there vegan pastries?' => "Currently, most of our pastries contain dairy and eggs. However, we're working on introducing vegan options soon! Would you like us to notify you when they're available? In the meantime, you can enjoy our drinks with plant-based milk alternatives.",
        'Caffeine content in matcha' => "Great question! Our matcha contains approximately 70mg of caffeine per serving, while a regular Americano has about 120mg. So matcha has roughly 60% of the caffeine content of coffee, providing a gentler energy boost with additional health benefits from antioxidants!",
      ],
      'order' => [
        'My order is taking too long' => "We sincerely apologize for the delay! We experienced an unexpected rush during peak hours. Your order is now being prioritized and should be ready in the next 5 minutes. We've also added a complimentary pastry to your order for the inconvenience. Thank you so much for your patience!",
        'Wrong item received' => "We're so sorry for the mix-up! Please bring the incorrect item back to the counter and we'll immediately prepare your Americano. We'll also refund the difference if there is any. This shouldn't have happened and we'll be more careful with order verification. Thank you for letting us know!",
        'Missing add-ons in my order' => "We sincerely apologize for this oversight! Please come back to the counter and we'll prepare your add-ons right away. We've also noted this in our system to prevent future occurrences. Your satisfaction is important to us!",
        'Order cancelled without notice' => "We apologize for the confusion! Your order was cancelled due to insufficient stock of one of the items at the time. We should have notified you immediately. If you were charged, the refund will be processed within 3-5 business days. We're truly sorry for this experience.",
        'Incorrect total amount charged' => "Thank you for bringing this to our attention! I've reviewed your order and you're absolutely right. We'll process a refund of ₱70 immediately. This will appear in your account within 3-5 business days. We sincerely apologize for the error and have flagged this for our team to review our checkout process.",
      ],
      'general' => [
        'Operating hours?' => "Our operating hours are 7:00 AM to 9:00 PM daily, including weekends! We're here to serve you your favorite coffee and treats throughout the week. Hope to see you soon!",
        'Do you offer delivery?' => "We're excited to share that we're currently working on a delivery service that will launch next month! For now, you can place orders for pickup through our app or website. We'll notify all customers once delivery becomes available. Stay tuned!",
        'Can I pre-order for tomorrow?' => "Absolutely! You can place your order through our app or call us directly at our shop number. Just specify your preferred pickup time (8 AM works perfectly!) and we'll have everything ready for you. Pre-orders must be placed at least 2 hours in advance.",
        'Loyalty rewards program?' => "We're currently developing a loyalty rewards program that will launch soon! It will include points for every purchase, birthday rewards, and exclusive offers. We'll announce the details through our app and social media. Thanks for your interest!",
      ],
      'feedback' => [
        'Excellent coffee!' => "Thank you so much for your kind words! We're thrilled you enjoyed our Americano. Your feedback means the world to us and motivates our team to keep delivering quality. We hope to serve you again soon! ☕",
        'Fresh pastries' => "We're so happy you loved our cinnamon rolls! Our bakers work hard every day to ensure everything is fresh and delicious. Thank you for taking the time to share your experience with us!",
        'Service was slow' => "Thank you for your honest feedback. We apologize for the wait time. We experienced higher than usual customer volume today and are working on improving our workflow during peak hours. We appreciate your patience and hope you'll give us another chance to provide you with faster service.",
        'Love the Ube Frappe!' => "We're so glad you love the Ube Frappe! It's one of our proud Filipino-inspired drinks and definitely here to stay. Thank you for your support and enthusiasm. Hope to see you again soon for another one!",
      ],
      'account' => [
        'Cannot reset password' => "I'd be happy to help! Please check your spam/junk folder as the email might have been filtered there. If you still don't see it, please provide your registered email address and I'll manually trigger a password reset for you. We'll get this sorted out!",
        'Update phone number' => "To update your phone number, please go to Settings > Profile > Edit Contact Information in your account. If you're having trouble accessing this or need assistance, please let me know your new number and I can update it for you directly.",
        'Delete account request' => "I'm sorry to see you go! To process your account deletion request, I need to verify some information for security purposes. Could you please confirm your registered email and phone number? Once verified, we'll process the deletion within 24 hours. All your data will be permanently removed as per our privacy policy.",
      ],
    ];

    return $replies[$type][$subject] ?? "Thank you for contacting Coffee Street. Our team is looking into this and will get back to you shortly. We appreciate your patience!";
  }
}
