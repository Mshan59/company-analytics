-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  assigned_to INT NULL,
  created_by INT NOT NULL,
  project_id INT NULL,
  due_date DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_assigned_to (assigned_to),
  INDEX idx_created_by (created_by),
  INDEX idx_project_id (project_id),
  INDEX idx_due_date (due_date)
);
