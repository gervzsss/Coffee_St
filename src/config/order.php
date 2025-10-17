<?php
// Centralized order configuration (can be loaded from env later)

return [
  'delivery_fee' => (float) ($_ENV['ORDER_DELIVERY_FEE'] ?? 1.78), // flat fee
  'tax_rate' => (float) ($_ENV['ORDER_TAX_RATE'] ?? 0.08),         // 8% as 0.08
];
