-- Add role_id column and backfill from existing role name, then drop old role column and add FK
START TRANSACTION;

-- 1) Add nullable role_id to allow backfill
ALTER TABLE `teams`
  ADD COLUMN `role_id` INT NULL AFTER `email`;

-- 2) Backfill role_id using the current role name
UPDATE `teams` t
JOIN `roles` r ON r.`name` = t.`role`
SET t.`role_id` = r.`id`;

-- 3) Make role_id NOT NULL now that it's populated
ALTER TABLE `teams`
  MODIFY COLUMN `role_id` INT NOT NULL;

-- 4) Add index and foreign key
ALTER TABLE `teams`
  ADD INDEX `idx_teams_role_id` (`role_id`);

ALTER TABLE `teams`
  ADD CONSTRAINT `fk_teams_role_id_roles_id`
    FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;

-- 5) Drop old ENUM role column
ALTER TABLE `teams`
  DROP COLUMN `role`;

COMMIT;
