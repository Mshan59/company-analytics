-- Migration: Add role column to users table for global, user-level role
-- Compatible with MySQL 5.7+/MariaDB 10.2+

ALTER TABLE `users`
  ADD COLUMN `role` ENUM('owner','admin','manager','member') NOT NULL DEFAULT 'member' AFTER `email`;

-- Optional: seed initial roles for existing users
-- Set first user as owner (adjust ids as needed)
UPDATE `users` SET `role` = 'owner' WHERE `id` = 1;
-- Example: make user id 2 a manager
UPDATE `users` SET `role` = 'manager' WHERE `id` = 2;

-- Optional: index for faster filtering by role
ALTER TABLE `users`
  ADD INDEX `idx_role` (`role`);
