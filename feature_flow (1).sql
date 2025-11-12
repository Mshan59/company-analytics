-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 11, 2025 at 07:45 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `feature_flow`
--

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('open','at-risk','blocked','on-track') DEFAULT 'open',
  `priority` enum('low','medium','high','urgent') DEFAULT 'medium',
  `category` varchar(100) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `team_id` int(11) DEFAULT NULL,
  `progress` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `name`, `description`, `status`, `priority`, `category`, `start_date`, `end_date`, `created_by`, `team_id`, `progress`, `created_at`, `updated_at`) VALUES
(1, 'AI-Powered Search', 'E-Commerce Platform', 'on-track', 'high', 'Development', '2024-10-01', '2024-12-15', 1, 1, 45, '2025-11-03 18:58:41', '2025-11-03 18:58:41'),
(2, 'User Authentication', 'Security System', 'at-risk', 'urgent', 'Security', '2024-09-15', '2024-11-30', 1, 1, 75, '2025-11-03 18:58:41', '2025-11-03 18:58:41'),
(3, 'Payment Gateway', 'Financial Module', 'blocked', 'high', 'Finance', '2024-08-01', '2024-10-30', 1, 2, 30, '2025-11-03 18:58:41', '2025-11-03 18:58:41'),
(4, 'Analytics Dashboard', 'Third party Services', 'on-track', 'medium', 'Analytics', '2024-10-15', '2025-01-15', 1, 1, 20, '2025-11-03 18:58:41', '2025-11-03 18:58:41'),
(5, 'Mobile App Redesign', 'UI/UX Improvement', 'open', 'high', 'Design', '2024-11-01', '2024-12-31', 1, 2, 10, '2025-11-03 18:58:41', '2025-11-03 18:58:41'),
(6, 'API Integration', 'Backend Services', 'on-track', 'medium', 'Development', '2024-09-01', '2024-11-15', 1, 1, 60, '2025-11-03 18:58:41', '2025-11-03 18:58:41');

-- --------------------------------------------------------

--
-- Table structure for table `project_insights`
--

CREATE TABLE `project_insights` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `insight_type` enum('risk','suggestion','milestone','alert') DEFAULT 'suggestion',
  `message` text NOT NULL,
  `severity` enum('low','medium','high') DEFAULT 'medium',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_insights`
--

INSERT INTO `project_insights` (`id`, `project_id`, `insight_type`, `message`, `severity`, `created_at`) VALUES
(1, 1, 'suggestion', 'Consider adding more unit tests for the search algorithm', 'low', '2025-11-03 18:58:42'),
(2, 1, 'milestone', 'Successfully completed Phase 1 of development', 'medium', '2025-11-03 18:58:42'),
(3, 2, 'risk', 'Authentication module deadline approaching with 25% work remaining', 'high', '2025-11-03 18:58:42'),
(4, 2, 'alert', 'Security audit required before deployment', 'high', '2025-11-03 18:58:42'),
(5, 3, 'risk', 'Payment gateway integration blocked due to API access issues', 'high', '2025-11-03 18:58:42'),
(6, 3, 'suggestion', 'Consider alternative payment providers', 'medium', '2025-11-03 18:58:42'),
(7, 4, 'suggestion', 'Dashboard performance can be improved with data caching', 'low', '2025-11-03 18:58:42'),
(8, 5, 'milestone', 'Design mockups approved by stakeholders', 'medium', '2025-11-03 18:58:42'),
(9, 6, 'suggestion', 'API documentation needs to be updated', 'low', '2025-11-03 18:58:42');

-- --------------------------------------------------------

--
-- Table structure for table `project_members`
--

CREATE TABLE `project_members` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role` enum('owner','admin','member','viewer') DEFAULT 'member',
  `joined_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_members`
--

INSERT INTO `project_members` (`id`, `project_id`, `user_id`, `role`, `joined_at`) VALUES
(1, 1, 1, 'owner', '2025-11-03 18:58:42'),
(2, 1, 2, 'admin', '2025-11-03 18:58:42'),
(3, 1, 3, 'member', '2025-11-03 18:58:42'),
(4, 1, 4, 'member', '2025-11-03 18:58:42'),
(5, 2, 1, 'owner', '2025-11-03 18:58:42'),
(6, 2, 2, 'member', '2025-11-03 18:58:42'),
(7, 2, 3, 'member', '2025-11-03 18:58:42'),
(8, 3, 1, 'owner', '2025-11-03 18:58:42'),
(9, 3, 4, 'admin', '2025-11-03 18:58:42'),
(10, 3, 5, 'member', '2025-11-03 18:58:42'),
(11, 4, 1, 'owner', '2025-11-03 18:58:42'),
(12, 4, 2, 'member', '2025-11-03 18:58:42'),
(13, 4, 3, 'member', '2025-11-03 18:58:42'),
(14, 4, 4, 'member', '2025-11-03 18:58:42'),
(15, 5, 1, 'owner', '2025-11-03 18:58:42'),
(16, 5, 3, 'admin', '2025-11-03 18:58:42'),
(17, 6, 1, 'owner', '2025-11-03 18:58:42'),
(18, 6, 2, 'member', '2025-11-03 18:58:42'),
(19, 6, 4, 'member', '2025-11-03 18:58:42');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(38, 'AI Engineer'),
(23, 'AI/ML Engineer'),
(20, 'API Developer'),
(15, 'Backend Developer'),
(1, 'CEO'),
(25, 'Cloud Engineer'),
(4, 'CMO'),
(3, 'COO'),
(2, 'CTO'),
(37, 'Data Analyst'),
(22, 'Data Engineer'),
(36, 'Data Scientist'),
(21, 'Database Administrator (DBA)'),
(24, 'DevOps Engineer'),
(32, 'Ethical Hacker'),
(14, 'Frontend Developer'),
(16, 'Full Stack Developer'),
(19, 'Game Developer'),
(34, 'Graphic Designer'),
(5, 'HR Manager'),
(39, 'IT Helpdesk'),
(8, 'Marketing - Digital Marketer'),
(9, 'Marketing - SEO Specialist'),
(10, 'Marketing - Social Media Manager'),
(18, 'Mobile Developer'),
(41, 'Network Engineer'),
(7, 'Office Admin'),
(30, 'Performance Tester'),
(33, 'Product Manager'),
(29, 'QA Automation Engineer'),
(28, 'QA Tester'),
(6, 'Recruiter'),
(12, 'Sales - Account Manager'),
(13, 'Sales - Business Analyst'),
(11, 'Sales - Sales Executive'),
(31, 'Security Tester'),
(27, 'Site Reliability Engineer (SRE)'),
(26, 'System Administrator'),
(40, 'Technical Support Engineer'),
(17, 'UI/UX Designer'),
(35, 'Web Designer');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('pending','in_progress','completed','cancelled') DEFAULT 'pending',
  `priority` enum('low','medium','high','urgent') DEFAULT 'medium',
  `assigned_to` int(11) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `project_id` int(11) DEFAULT NULL,
  `due_date` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `title`, `description`, `status`, `priority`, `assigned_to`, `created_by`, `project_id`, `due_date`, `created_at`, `updated_at`) VALUES
(2, 'SFC In Smiline ', 'Add member in ', 'pending', 'medium', NULL, 1, NULL, NULL, '2025-08-16 10:05:14', '2025-08-16 10:05:23'),
(3, 'UI Design Review', 'Review and approve the search interface design', 'pending', 'high', 2, 1, 1, '2025-11-05 00:00:00', '2025-11-03 18:58:42', '2025-11-03 18:58:42'),
(4, 'API Documentation', 'Complete API documentation for search endpoints', 'in_progress', 'medium', 3, 1, 1, '2025-11-07 00:00:00', '2025-11-03 18:58:42', '2025-11-03 18:58:42'),
(5, 'Performance Testing', 'Conduct performance tests on search algorithm', 'pending', 'high', 4, 1, 1, '2025-11-09 00:00:00', '2025-11-03 18:58:42', '2025-11-03 18:58:42'),
(6, 'Security Audit', 'Complete security audit of authentication system', 'pending', 'urgent', 2, 1, 2, '2025-11-06 00:00:00', '2025-11-03 18:58:42', '2025-11-03 18:58:42'),
(7, '2FA Implementation', 'Implement two-factor authentication', 'in_progress', 'high', 3, 1, 2, '2025-11-08 00:00:00', '2025-11-03 18:58:42', '2025-11-03 18:58:42'),
(8, 'Gateway Integration', 'Integrate payment gateway API', 'pending', 'urgent', 4, 1, 3, '2025-11-05 00:00:00', '2025-11-03 18:58:42', '2025-11-03 18:58:42'),
(9, 'Transaction Testing', 'Test payment transactions', 'pending', 'high', 5, 1, 3, '2025-11-10 00:00:00', '2025-11-03 18:58:42', '2025-11-03 18:58:42'),
(10, 'Data Visualization', 'Create charts and graphs for analytics', 'in_progress', 'medium', 2, 1, 4, '2025-11-07 00:00:00', '2025-11-03 18:58:42', '2025-11-03 18:58:42'),
(11, 'Export Functionality', 'Add export to CSV/PDF feature', 'pending', 'low', 3, 1, 4, '2025-11-11 00:00:00', '2025-11-03 18:58:42', '2025-11-03 18:58:42'),
(12, 'Wireframe Creation', 'Create wireframes for all screens', 'completed', 'high', 3, 1, 5, '2025-11-04 00:00:00', '2025-11-03 18:58:42', '2025-11-03 18:58:42'),
(13, 'Prototype Development', 'Develop interactive prototype', 'in_progress', 'high', 3, 1, 5, '2025-11-06 00:00:00', '2025-11-03 18:58:42', '2025-11-03 18:58:42'),
(14, 'Endpoint Development', 'Develop REST API endpoints', 'in_progress', 'medium', 2, 1, 6, '2025-11-08 00:00:00', '2025-11-03 18:58:42', '2025-11-03 18:58:42'),
(15, 'API Testing', 'Write integration tests for APIs', 'pending', 'medium', 4, 1, 6, '2025-11-09 00:00:00', '2025-11-03 18:58:42', '2025-11-03 18:58:42');

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `role` enum('developer','HR','Sr developer','Project manager') NOT NULL DEFAULT 'developer',
  `added_on` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`id`, `name`, `email`, `role`, `added_on`) VALUES
(2, 'Mukhtar ul Islam', 'mukhtar@gmail.com', 'Sr developer', '2025-03-15 11:32:46'),
(4, 'Shahbaz Anwar', 'shan@gmail.com', 'Sr developer', '2025-03-15 11:37:38'),
(5, 'Dilshad ansari', 'dilshadansari@gmail.com', 'Sr developer', '2025-03-16 10:43:27'),
(6, 'Sajid', 'sajid@gmail.com', 'Sr developer', '2025-03-16 10:46:15'),
(7, 'MOHAMMAD SHAHWAZ', 'mshan2acc@gmail.com', 'developer', '2025-08-14 09:34:26');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` enum('owner','admin','manager','member') NOT NULL DEFAULT 'member',
  `password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `firm` varchar(100) DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  `specialty` varchar(100) DEFAULT NULL,
  `bar_number` varchar(50) DEFAULT NULL,
  `years_experience` int(11) DEFAULT NULL,
  `education` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`, `phone`, `address`, `firm`, `position`, `specialty`, `bar_number`, `years_experience`, `education`, `bio`, `updated_at`) VALUES
(1, 'shahbaz khan', 'shahbazkhan@gmail.com', '12345', '2025-03-15 10:28:08', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-10 06:15:27'),
(2, 'Mukhtar ul Islam', 'mukhtar@gmail.com', '11223344', '2025-03-15 10:52:10', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-10 06:15:27'),
(4, 'Sarah Johnson', 'sarah.johnson@lawfirm.com', NULL, '2025-03-15 11:18:27', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-10 06:15:27'),
(5, 'John Doe', 'test@example.com', '$2a$10$dsdds', '2025-03-16 07:35:16', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-10 06:15:27'),
(6, 'dilshad ansari', 'dilshadansari@gmail.com', '$2b$10$92sUZd6yqWKz8v.Ptfc24ecNHsb3fQ/X/pvBVQWpoKHLFGKBZOh/.', '2025-03-16 08:37:00', '9087876654', 'Kolkata', 'Hyderabad', NULL, 'Java Developer', 'NY123456', 3, 'MCA', NULL, '2025-11-10 06:25:23'),
(7, 'dilshad ansari', 'dilshadansari@gmail.com', '$2b$10$EDj/CiJtMQfbiRWGGr2Pceq.i0xEx2T17701gjaopfLwU.L6Cq3dy', '2025-03-16 08:37:33', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-10 06:15:27'),
(8, 'dilshad ansari', 'dilshadansari@gmail.com', '$2b$10$NZzWWcEl2vwWyWXEcJGGP.OSk0wxSmH0.tNFE1eE5ceQDQ.N4SJ0C', '2025-03-16 08:43:24', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-10 06:15:27'),
(9, 'shabbir', 'shabbir@gmail.com', '$2b$10$Ayb3DgIf/2GObue.RQYmQeNYhrl0YD0pLpOnx4PjaxY/yTGsO1S3G', '2025-03-17 04:18:06', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-10 06:15:27'),
(10, 'shabbir', 'shabbir@gmail.com', '$2b$10$gSUgDL5wnkfIKw.Cb8jqt.hI3HdL6f3Eplezq1OVoFq8bFL.5fWIO', '2025-03-17 04:18:55', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-10 06:15:27');

-- Seed example global roles
UPDATE `users` SET `role` = 'owner'  WHERE `id` = 1;
UPDATE `users` SET `role` = 'manager' WHERE `id` = 2;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_priority` (`priority`),
  ADD KEY `idx_created_by` (`created_by`),
  ADD KEY `idx_team_id` (`team_id`),
  ADD KEY `idx_start_date` (`start_date`),
  ADD KEY `idx_end_date` (`end_date`);

--
-- Indexes for table `project_insights`
--
ALTER TABLE `project_insights`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_project_id` (`project_id`),
  ADD KEY `idx_insight_type` (`insight_type`);

--
-- Indexes for table `project_members`
--
ALTER TABLE `project_members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_project_member` (`project_id`,`user_id`),
  ADD KEY `idx_project_id` (`project_id`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_priority` (`priority`),
  ADD KEY `idx_assigned_to` (`assigned_to`),
  ADD KEY `idx_created_by` (`created_by`),
  ADD KEY `idx_project_id` (`project_id`),
  ADD KEY `idx_due_date` (`due_date`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_role` (`role`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `project_insights`
--
ALTER TABLE `project_insights`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `project_members`
--
ALTER TABLE `project_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
