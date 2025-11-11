-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('open', 'at-risk', 'blocked', 'on-track') DEFAULT 'open',
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  category VARCHAR(100),
  start_date DATE NULL,
  end_date DATE NULL,
  created_by INT NOT NULL,
  team_id INT NULL,
  progress INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_created_by (created_by),
  INDEX idx_team_id (team_id),
  INDEX idx_start_date (start_date),
  INDEX idx_end_date (end_date)
);

-- Create project_members table for team assignments
CREATE TABLE IF NOT EXISTS project_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  role ENUM('owner', 'admin', 'member', 'viewer') DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_project_member (project_id, user_id),
  INDEX idx_project_id (project_id),
  INDEX idx_user_id (user_id)
);

-- Create project_insights table for AI insights
CREATE TABLE IF NOT EXISTS project_insights (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  insight_type ENUM('risk', 'suggestion', 'milestone', 'alert') DEFAULT 'suggestion',
  message TEXT NOT NULL,
  severity ENUM('low', 'medium', 'high') DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_project_id (project_id),
  INDEX idx_insight_type (insight_type)
);
