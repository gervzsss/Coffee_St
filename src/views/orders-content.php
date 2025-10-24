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