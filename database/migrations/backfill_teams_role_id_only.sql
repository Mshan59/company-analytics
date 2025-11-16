START TRANSACTION;

-- 1) Temporarily allow NULL to backfill safely
ALTER TABLE `teams`
  MODIFY COLUMN `role_id` INT NULL;

-- 2) Backfill role_id from legacy role name (case-insensitive)
UPDATE `teams` t
JOIN `roles` r ON LOWER(r.`name`) = LOWER(t.`role`)
SET t.`role_id` = r.`id`
WHERE t.`role_id` IS NULL OR t.`role_id` = 0;
;;;;;
-- 3) Default any remaining to Developer, if present
UPDATE `teams` t
JOIN (
  SELECT `id` FROM `roles` WHERE LOWER(`name`) = 'developer' LIMIT 1
) d ON 1=1
SET t.`role_id` = d.`id`
WHERE t.`role_id` IS NULL OR t.`role_id` = 0;

-- 4) Fallback to any available role if Developer not found
UPDATE `teams` t
JOIN (
  SELECT `id` FROM `roles` ORDER BY `id` LIMIT 1
) d ON 1=1
SET t.`role_id` = d.`id`
WHERE t.`role_id` IS NULL OR t.`role_id` = 0;

-- 5) Enforce NOT NULL again
ALTER TABLE `teams`
  MODIFY COLUMN `role_id` INT NOT NULL;

COMMIT;
