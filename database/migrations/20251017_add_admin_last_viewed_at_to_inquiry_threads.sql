-- Add admin_last_viewed_at to track when admin last viewed a thread
ALTER TABLE inquiry_threads
  ADD COLUMN admin_last_viewed_at DATETIME NULL AFTER last_message_at;