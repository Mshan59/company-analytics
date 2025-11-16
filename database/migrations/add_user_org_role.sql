-- Add org_role_id to users and foreign key to roles(id)
ALTER TABLE `users`
  ADD COLUMN `org_role_id` INT NULL AFTER `role`;

ALTER TABLE `users`
  ADD INDEX `idx_org_role_id` (`org_role_id`);

-- Optional FK (comment out if not desired)
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_org_role`
  FOREIGN KEY (`org_role_id`) REFERENCES `roles`(`id`) ON UPDATE CASCADE ON DELETE SET NULL;
