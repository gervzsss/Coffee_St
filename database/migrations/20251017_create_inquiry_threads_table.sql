CREATE TABLE IF NOT EXISTS `inquiry_threads` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NULL,
  `guest_email` VARCHAR(190) NULL,
  `guest_name` VARCHAR(190) NULL,
  `subject` VARCHAR(255) NOT NULL,
  `status` ENUM('pending','responded','done') NOT NULL DEFAULT 'pending',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_message_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_threads_user_subject` (`user_id`, `subject`),
  INDEX `idx_threads_guest_subject` (`guest_email`, `subject`),
  INDEX `idx_threads_status_last_message` (`status`, `last_message_at`),
  CONSTRAINT `fk_threads_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
