-- Create roles table and seed it with the organization's role hierarchy

CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed executive roles
INSERT IGNORE INTO roles (name) VALUES
  ('CEO'),
  ('CTO'),
  ('COO'),
  ('CMO');

-- Seed HR & Admin
INSERT IGNORE INTO roles (name) VALUES
  ('HR Manager'),
  ('Recruiter'),
  ('Office Admin');

-- Seed Marketing
INSERT IGNORE INTO roles (name) VALUES
  ('Marketing - Digital Marketer'),
  ('Marketing - SEO Specialist'),
  ('Marketing - Social Media Manager');

-- Seed Sales
INSERT IGNORE INTO roles (name) VALUES
  ('Sales - Sales Executive'),
  ('Sales - Account Manager'),
  ('Sales - Business Analyst');

-- Seed Engineering (Software Dev, DevOps, QA, etc.)
INSERT IGNORE INTO roles (name) VALUES
  ('Frontend Developer'),
  ('Backend Developer'),
  ('Full Stack Developer'),
  ('UI/UX Designer'),
  ('Mobile Developer'),
  ('Game Developer'),
  ('API Developer'),
  ('Database Administrator (DBA)'),
  ('Data Engineer'),
  ('AI/ML Engineer'),
  ('DevOps Engineer'),
  ('Cloud Engineer'),
  ('System Administrator'),
  ('Site Reliability Engineer (SRE)'),
  ('QA Tester'),
  ('QA Automation Engineer'),
  ('Performance Tester'),
  ('Security Tester'),
  ('Ethical Hacker');

-- Seed Product & Design
INSERT IGNORE INTO roles (name) VALUES
  ('Product Manager'),
  ('Graphic Designer'),
  ('Web Designer');

-- Seed Data & AI
INSERT IGNORE INTO roles (name) VALUES
  ('Data Scientist'),
  ('Data Analyst'),
  ('AI Engineer');

-- Seed IT Support & Maintenance
INSERT IGNORE INTO roles (name) VALUES
  ('IT Helpdesk'),
  ('Technical Support Engineer'),
  ('Network Engineer');
