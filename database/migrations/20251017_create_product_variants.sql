-- Product variants/add-ons
CREATE TABLE IF NOT EXISTS `product_variants` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `group_name` VARCHAR(120) NOT NULL,         -- e.g., Size, Milk, Toppings
  `name` VARCHAR(120) NOT NULL,               -- e.g., Large, Oat Milk
  `price_delta` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_variants_product` (`product_id`),
  CONSTRAINT `fk_variants_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Extend cart_items: store variant snapshot
ALTER TABLE `cart_items`
  ADD COLUMN `variant_id` BIGINT UNSIGNED NULL AFTER `product_id`,
  ADD COLUMN `variant_name` VARCHAR(255) NULL AFTER `variant_id`,
  ADD COLUMN `price_delta` DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER `unit_price`;

-- Extend order_items with variant snapshot
ALTER TABLE `order_items`
  ADD COLUMN `variant_id` BIGINT UNSIGNED NULL AFTER `product_id`,
  ADD COLUMN `variant_name` VARCHAR(255) NULL AFTER `variant_id`,
  ADD COLUMN `price_delta` DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER `unit_price`;
