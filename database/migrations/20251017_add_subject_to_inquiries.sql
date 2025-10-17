-- Migration: Add nullable subject column to inquiries table
ALTER TABLE inquiries ADD COLUMN subject VARCHAR(255) NULL AFTER email;