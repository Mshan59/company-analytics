START TRANSACTION;

CREATE TABLE IF NOT EXISTS `timesheets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `project_id` INT NULL,
  `team_id` INT NULL,
  `work_date` DATE NOT NULL,
  `hours` DECIMAL(6,2) NOT NULL DEFAULT 0.00,
  `notes` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_timesheets_user_id` (`user_id`),
  KEY `idx_timesheets_project_id` (`project_id`),
  KEY `idx_timesheets_team_id` (`team_id`),
  KEY `idx_timesheets_work_date` (`work_date`),
  CONSTRAINT `fk_timesheets_user_id_users_id`
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_timesheets_project_id_projects_id`
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT `fk_timesheets_team_id_teams_id`
    FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;
