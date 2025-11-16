START TRANSACTION;

-- Company-level budget (single row expected, but not enforced)
CREATE TABLE IF NOT EXISTS `budgets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `total_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'INR',
  `fiscal_year` VARCHAR(9) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Per-project allocation (1 row per project)
CREATE TABLE IF NOT EXISTS `project_budgets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `project_id` INT NOT NULL,
  `allocated_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_project_budget_project_id` (`project_id`),
  KEY `idx_project_budgets_project_id` (`project_id`),
  CONSTRAINT `fk_project_budgets_project_id_projects_id`
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Expenses (optionally linked to project). Owner/Admin will manage.
CREATE TABLE IF NOT EXISTS `expenses` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `project_id` INT NULL,
  `category` VARCHAR(50) NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL,
  `description` VARCHAR(255) NULL,
  `incurred_on` DATE NOT NULL,
  `created_by` INT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_expenses_project_id` (`project_id`),
  KEY `idx_expenses_incurred_on` (`incurred_on`),
  KEY `idx_expenses_project_incurred` (`project_id`,`incurred_on`),
  CONSTRAINT `fk_expenses_project_id_projects_id`
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  CONSTRAINT `fk_expenses_created_by_users_id`
    FOREIGN KEY (`created_by`) REFERENCES `users`(`id`)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;
