-- =========================================================================
-- DATABASE CREATION AND SCHEMA SETUP FOR PORTFOLIO WEBSITE
-- =========================================================================
-- Purpose: This script initializes the database schema for the portfolio.
-- It creates the database, creates the necessary tables, and seeds the projects table.
-- =========================================================================

-- 1. Create the Database
-- This command tells MySQL to create a new storage space (schema) called 'portfolio_db'.
-- The "IF NOT EXISTS" clause prevents errors if the database is already created.
CREATE DATABASE IF NOT EXISTS portfolio_db;

-- 2. Select the Database
-- This tells MySQL to use 'portfolio_db' for all subsequent operations in this script.
USE portfolio_db;

-- 3. Create the Projects Table
-- This table stores details of the projects you want to show on your website.
-- Doing this dynamically from the database allows you to update projects without changing frontend HTML code!
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,            -- A unique ID for each project (automatically increases by 1)
    title VARCHAR(100) NOT NULL,                  -- The name of the project
    description TEXT NOT NULL,                    -- A detailed summary of what the project does
    technologies VARCHAR(255) NOT NULL,           -- Comma-separated list of technologies used
    image_url VARCHAR(255),                       -- Path to the project's cover image
    github_link VARCHAR(255),                     -- Link to the source code on GitHub
    demo_link VARCHAR(255)                        -- Link to a live running demo of the project (optional)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Create the Contact Table
-- This table stores message details submitted by visitors through your contact form.
CREATE TABLE IF NOT EXISTS contact (
    id INT AUTO_INCREMENT PRIMARY KEY,            -- A unique ID for each contact message submission
    name VARCHAR(100) NOT NULL,                   -- Name of the person contacting you
    email VARCHAR(100) NOT NULL,                  -- Email address of the sender (to reply to them)
    subject VARCHAR(150) NOT NULL,                -- The subject line of their message
    message TEXT NOT NULL,                        -- The main content of their message
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- The date and time the message was sent
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================================
-- SEED DATA (INITIAL DATA INSERTION)
-- =========================================================================
-- We will insert your customized projects into the projects table so the frontend has data to fetch immediately.

TRUNCATE TABLE projects; -- Clear the table first to prevent duplicate entries on rerun

INSERT INTO projects (title, description, technologies, image_url, github_link, demo_link) VALUES
(
    'Notice Management System',
    'Developed a web-based notice management platform. Students can view notices relevant to their department, class, or category. Improved communication and accessibility of academic announcements.',
    'HTML5, CSS3, JavaScript, Node.js, Express, MySQL',
    './assets/images/notice-system.jpg',
    'https://github.com/hemalatha-shetty/notice-management-system',
    'https://notice-system-demo.example.com'
),
(
    'Student Result Management System',
    'Built a system to manage and display student academic results. Allows efficient storage, retrieval, and management of result data. Implemented database integration for secure record management.',
    'HTML5, CSS3, JavaScript, Java, Spring Boot, MySQL',
    './assets/images/result-system.jpg',
    'https://github.com/hemalatha-shetty/student-result-system',
    'https://result-system-demo.example.com'
),
(
    'Smart Light and Fan Control System',
    'Developed an IoT-based system to control light brightness and fan speed. Used ESP32 and web-based controls for remote operation. Improved energy efficiency and user convenience.',
    'ESP32, Arduino, WebSockets, HTML5, CSS3, JavaScript',
    './assets/images/smart-home.jpg',
    'https://github.com/hemalatha-shetty/smart-home-control',
    'https://smart-home-demo.example.com'
);
