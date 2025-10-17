CREATE TABLE IF NOT EXISTS `thread_messages` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `thread_id` BIGINT UNSIGNED NOT NULL,
  `sender_type` ENUM('user','guest','admin') NOT NULL,
  `sender_id` BIGINT UNSIGNED NULL,
  `sender_name` VARCHAR(190) NULL,
  `sender_email` VARCHAR(190) NULL,
  `message` TEXT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_thread_messages_thread_created` (`thread_id`, `created_at`),
  CONSTRAINT `fk_thread_messages_thread`
    FOREIGN KEY (`thread_id`) REFERENCES `inquiry_threads` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_thread_messages_user`
    FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
