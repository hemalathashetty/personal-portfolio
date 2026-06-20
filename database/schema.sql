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
-- We will insert your new advanced projects into the projects table so the frontend has data to fetch immediately.

TRUNCATE TABLE projects; -- Clear the table first to prevent duplicate entries on rerun

INSERT INTO projects (title, description, technologies, image_url, github_link, demo_link) VALUES
(
    'PulseGuard',
    'Self-healing reliability control plane protecting service chains from cascading failures. Features adaptive throttling, distributed rate limiting (using Redis Lua token bucket), and circuit breakers with backpressure propagation. Includes a real-time SRE dashboard displaying live topology, chaos engineering controls, and automated recovery actions.',
    'FastAPI, Redis, Prometheus, Grafana',
    './assets/images/pulse-guard.jpg',
    'https://github.com/MercuryXNexus/PulseGuard',
    'https://hemashetty-21-pulse-guard.hf.space/'
),
(
    'Mercury-X',
    'Pricing and inventory engine for automated demand forecasting and replenishment. Implements a dynamic/surge pricing algorithm driven by real-time inventory and consumer demand, and an inventory optimizer offering transfer recommendations. Features an executive business dashboard backed by an Apache Kafka event bus.',
    'FastAPI, PostgreSQL, Redis, Apache Kafka',
    './assets/images/mercury-x.jpg',
    'https://github.com/MercuryXNexus/Mercury-X',
    'https://hemashetty-21-mercury-x.hf.space/'
),
(
    'Distributed Job Scheduler',
    'A robust distributed task queue built as core infrastructure rather than a basic consumer app. Features independent server workers, a Redis/Postgres-backed state ledger, retry policies with backoff, dead-letter queues, and priority scheduling. Implements concurrency-safe, idempotent job claiming with Dockerized worker pools.',
    'FastAPI, Redis, PostgreSQL, Docker',
    './assets/images/job-scheduler.jpg',
    'https://github.com/MercuryXNexus/nexus-task-queue',
    'https://nexus-task-queue.onrender.com'
);
