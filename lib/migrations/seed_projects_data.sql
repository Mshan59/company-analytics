-- Sample data for testing the Projects API
-- Make sure to run create_projects_table.sql first

-- Insert sample projects
INSERT INTO projects (name, description, status, priority, category, start_date, end_date, created_by, team_id, progress) VALUES
('AI-Powered Search', 'E-Commerce Platform', 'on-track', 'high', 'Development', '2024-10-01', '2024-12-15', 1, 1, 45),
('User Authentication', 'Security System', 'at-risk', 'urgent', 'Security', '2024-09-15', '2024-11-30', 1, 1, 75),
('Payment Gateway', 'Financial Module', 'blocked', 'high', 'Finance', '2024-08-01', '2024-10-30', 1, 2, 30),
('Analytics Dashboard', 'Third party Services', 'on-track', 'medium', 'Analytics', '2024-10-15', '2025-01-15', 1, 1, 20),
('Mobile App Redesign', 'UI/UX Improvement', 'open', 'high', 'Design', '2024-11-01', '2024-12-31', 1, 2, 10),
('API Integration', 'Backend Services', 'on-track', 'medium', 'Development', '2024-09-01', '2024-11-15', 1, 1, 60);

-- Insert sample project members (assuming user IDs 1-5 exist)
INSERT INTO project_members (project_id, user_id, role) VALUES
-- AI-Powered Search team
(1, 1, 'owner'),
(1, 2, 'admin'),
(1, 3, 'member'),
(1, 4, 'member'),
-- User Authentication team
(2, 1, 'owner'),
(2, 2, 'member'),
(2, 3, 'member'),
-- Payment Gateway team
(3, 1, 'owner'),
(3, 4, 'admin'),
(3, 5, 'member'),
-- Analytics Dashboard team
(4, 1, 'owner'),
(4, 2, 'member'),
(4, 3, 'member'),
(4, 4, 'member'),
-- Mobile App Redesign team
(5, 1, 'owner'),
(5, 3, 'admin'),
-- API Integration team
(6, 1, 'owner'),
(6, 2, 'member'),
(6, 4, 'member');

-- Insert sample project insights
INSERT INTO project_insights (project_id, insight_type, message, severity) VALUES
(1, 'suggestion', 'Consider adding more unit tests for the search algorithm', 'low'),
(1, 'milestone', 'Successfully completed Phase 1 of development', 'medium'),
(2, 'risk', 'Authentication module deadline approaching with 25% work remaining', 'high'),
(2, 'alert', 'Security audit required before deployment', 'high'),
(3, 'risk', 'Payment gateway integration blocked due to API access issues', 'high'),
(3, 'suggestion', 'Consider alternative payment providers', 'medium'),
(4, 'suggestion', 'Dashboard performance can be improved with data caching', 'low'),
(5, 'milestone', 'Design mockups approved by stakeholders', 'medium'),
(6, 'suggestion', 'API documentation needs to be updated', 'low');

-- Insert sample tasks for projects (if tasks table exists)
-- These tasks will show up in the project dashboard
INSERT INTO tasks (title, description, status, priority, assigned_to, created_by, project_id, due_date) VALUES
-- AI-Powered Search tasks
('UI Design Review', 'Review and approve the search interface design', 'pending', 'high', 2, 1, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY)),
('API Documentation', 'Complete API documentation for search endpoints', 'in_progress', 'medium', 3, 1, 1, DATE_ADD(CURDATE(), INTERVAL 3 DAY)),
('Performance Testing', 'Conduct performance tests on search algorithm', 'pending', 'high', 4, 1, 1, DATE_ADD(CURDATE(), INTERVAL 5 DAY)),

-- User Authentication tasks
('Security Audit', 'Complete security audit of authentication system', 'pending', 'urgent', 2, 1, 2, DATE_ADD(CURDATE(), INTERVAL 2 DAY)),
('2FA Implementation', 'Implement two-factor authentication', 'in_progress', 'high', 3, 1, 2, DATE_ADD(CURDATE(), INTERVAL 4 DAY)),

-- Payment Gateway tasks
('Gateway Integration', 'Integrate payment gateway API', 'pending', 'urgent', 4, 1, 3, DATE_ADD(CURDATE(), INTERVAL 1 DAY)),
('Transaction Testing', 'Test payment transactions', 'pending', 'high', 5, 1, 3, DATE_ADD(CURDATE(), INTERVAL 6 DAY)),

-- Analytics Dashboard tasks
('Data Visualization', 'Create charts and graphs for analytics', 'in_progress', 'medium', 2, 1, 4, DATE_ADD(CURDATE(), INTERVAL 3 DAY)),
('Export Functionality', 'Add export to CSV/PDF feature', 'pending', 'low', 3, 1, 4, DATE_ADD(CURDATE(), INTERVAL 7 DAY)),

-- Mobile App Redesign tasks
('Wireframe Creation', 'Create wireframes for all screens', 'completed', 'high', 3, 1, 5, CURDATE()),
('Prototype Development', 'Develop interactive prototype', 'in_progress', 'high', 3, 1, 5, DATE_ADD(CURDATE(), INTERVAL 2 DAY)),

-- API Integration tasks
('Endpoint Development', 'Develop REST API endpoints', 'in_progress', 'medium', 2, 1, 6, DATE_ADD(CURDATE(), INTERVAL 4 DAY)),
('API Testing', 'Write integration tests for APIs', 'pending', 'medium', 4, 1, 6, DATE_ADD(CURDATE(), INTERVAL 5 DAY));

-- Verify the data
SELECT 'Projects created:' as info, COUNT(*) as count FROM projects;
SELECT 'Project members added:' as info, COUNT(*) as count FROM project_members;
SELECT 'Project insights added:' as info, COUNT(*) as count FROM project_insights;
SELECT 'Tasks created:' as info, COUNT(*) as count FROM tasks WHERE project_id IS NOT NULL;
