<?php

require_once __DIR__ . '/../../src/config/bootstrap.php';
require_once BASE_PATH . '/src/repositories/repositories.php';
use App\Repositories\OrderRepository;
use function App\Helpers\current_user;
use function App\Helpers\db;
use function App\Helpers\is_authenticated;

if (!is_authenticated()) {
  header('Location: /COFFEE_ST/public/index.php');
  exit;
}

$title = 'My Orders - Coffee St.';
$repo = new OrderRepository(db());
$orders = $repo->listForUser((int) current_user()['id']);
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><?php echo htmlspecialchars($title); ?></title>
  <link rel="stylesheet" href="/COFFEE_ST/dist/styles.css" />
</head>

<body class="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
  <?php include __DIR__ . '/../../src/includes/header.php'; ?>

  <main class="mx-auto max-w-5xl px-4 py-32">
    <h1 class="text-3xl md:text-4xl font-bold text-[#30442B] mb-6">My Orders</h1>
    <?php if (empty($orders)): ?>
      <div class="rounded-lg border bg-white p-6 shadow-sm">
        <p class="text-neutral-700">No orders yet.</p>
      </div>
    <?php else: ?>
      <div class="rounded-lg border bg-white shadow-sm">
        <table class="w-full text-sm">
          <thead class="text-neutral-500 border-b">
            <tr>
              <th class="text-left p-4">Order ID</th>
              <th class="text-left p-4">Date</th>
              <th class="text-right p-4">Total</th>
              <th class="text-left p-4">Status</th>
              <th class="p-4"></th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($orders as $o): ?>
              <tr class="border-b last:border-0">
                <td class="p-4 font-medium">#<?php echo (int) ($o->id ?? 0); ?></td>
                <td class="p-4"><?php echo htmlspecialchars(date('M j, Y g:i A', strtotime($o->created_at ?? 'now'))); ?>
                </td>
                <td class="p-4 text-right">$<?php echo number_format($o->total ?? 0, 2); ?></td>
                <td class="p-4 text-right">₱<?php echo number_format($o->total ?? 0, 2); ?></td>
                <td class="p-4 uppercase text-[#30442B]"><?php echo htmlspecialchars($o->status ?? ''); ?></td>
                <td class="p-4 text-right"><a class="text-[#30442B] underline"
                    href="/COFFEE_ST/public/pages/order-view.php?id=<?php echo (int) ($o->id ?? 0); ?>">View</a></td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    <?php endif; ?>
  </main>

  <?php include __DIR__ . '/../../src/includes/footer.php'; ?>
  <script src="/COFFEE_ST/src/resources/jquery-3.7.1.min.js"></script>
  <script src="/COFFEE_ST/src/resources/js/app.js"></script>
  <script src="/COFFEE_ST/src/resources/js/login-validation.js"></script>
</body>

</html>