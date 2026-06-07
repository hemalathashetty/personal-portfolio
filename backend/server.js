// =========================================================================
// EXPRESS.JS BACKEND SERVER (server.js)
// =========================================================================
// Purpose: This is the entry point of your Node.js backend application.
// It sets up the Express server, opens routes, connects to MySQL, and processes API requests.
// =========================================================================

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// =========================================================================
// MIDDLEWARE CONFIGURATION
// =========================================================================
// Middleware is code that executes after the request is received but before the route handler.
// -------------------------------------------------------------------------

// 1. CORS (Cross-Origin Resource Sharing)
// Enables your frontend (running on a port like 3000 or from a file) to request resources from your backend (running on port 5000).
app.use(cors({
    origin: '*', // In production, replace '*' with your frontend domain for security (e.g., 'https://myportfolio.vercel.app')
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-admin-password']
}));

// 2. Body Parser
// Configures Express to automatically parse incoming requests with JSON payloads.
// Without this, `req.body` would be undefined in POST requests.
app.use(express.json());


// =========================================================================
// TEST DATABASE CONNECTION
// =========================================================================
// On server startup, we verify that we can connect to MySQL to fail fast if config is wrong.
db.getConnection()
    .then(connection => {
        console.log('✅ Connected to MySQL database successfully!');
        connection.release(); // Return connection back to the pool
    })
    .catch(err => {
        console.error('❌ Database connection failed. Please check MySQL settings in .env.');
        console.error('Details:', err.message);
    });


// =========================================================================
// REST API ENDPOINTS
// =========================================================================

// 1. Welcome Route (Health Check)
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Personal Portfolio API Server!' });
});

// 2. GET /api/projects
// Fetch all project cards stored in the database.
app.get('/api/projects', async (req, res, next) => {
    try {
        // Execute a SELECT query on the MySQL promise pool
        const [rows] = await db.query('SELECT * FROM projects ORDER BY id ASC');
        
        // Respond to the client with the projects in JSON format
        res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        // Pass the error to Express's global error handler
        next(error);
    }
});

// 3. POST /api/contact
// Receives contact form submissions, validates input data, and stores it in the database.
app.post('/api/contact', async (req, res, next) => {
    const { name, email, subject, message } = req.body;

    // --- SECURITY PRACTICE: INPUT VALIDATION & SANITIZATION ---
    // Ensure all required fields exist and are not empty
    if (!name || !email || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed: All fields (name, email, subject, message) are required.'
        });
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed: Please enter a valid email address.'
        });
    }

    try {
        // SQL parameterized query (using ? placeholders).
        // --- SECURITY PRACTICE: PREVENTING SQL INJECTION ---
        // Placing data inside an array passed to db.query ensures that MySQL compiles the SQL query first,
        // treating the inputs purely as data values. This blocks hackers from typing malicious SQL commands in fields.
        const insertQuery = `
            INSERT INTO contact (name, email, subject, message)
            VALUES (?, ?, ?, ?)
        `;
        const values = [name.trim(), email.trim(), subject.trim(), message.trim()];

        const [result] = await db.query(insertQuery, values);

        console.log(`✉️ New contact message received from: ${name} (ID: ${result.insertId})`);

        res.status(201).json({
            success: true,
            message: 'Your message has been received! Thank you for reaching out.',
            messageId: result.insertId
        });
    } catch (error) {
        next(error);
    }
});

// 4. GET /api/contact
// Fetch all submitted contact messages. Useful for viewing contact requests.
app.get('/api/contact', async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT * FROM contact ORDER BY created_at DESC');
        
        res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        next(error);
    }
});

// =========================================================================
// ADMIN SECURITY AUTHENTICATION MIDDLEWARE
// =========================================================================
// A simple authentication checkpoint to prevent unauthorized visitors 
// from modifying projects in the database.
const adminAuth = (req, res, next) => {
    const adminPassword = req.headers['x-admin-password'];
    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (!adminPassword || adminPassword !== expectedPassword) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: Invalid admin password credentials.'
        });
    }
    next(); // Pass control to the actual endpoint handler
};

// 5. POST /api/projects
// Inserts a new project into the database. (Secured by adminAuth)
app.post('/api/projects', adminAuth, async (req, res, next) => {
    const { title, description, technologies, image_url, github_link, demo_link } = req.body;

    if (!title || !description || !technologies) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed: Title, Description, and Technologies are required.'
        });
    }

    try {
        const query = `
            INSERT INTO projects (title, description, technologies, image_url, github_link, demo_link)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [
            title.trim(),
            description.trim(),
            technologies.trim(),
            image_url ? image_url.trim() : '',
            github_link ? github_link.trim() : '',
            demo_link ? demo_link.trim() : ''
        ];

        const [result] = await db.query(query, values);

        console.log(`📁 Admin created a new project: "${title}" (ID: ${result.insertId})`);

        res.status(201).json({
            success: true,
            message: 'Project successfully added to the database!',
            projectId: result.insertId
        });
    } catch (error) {
        next(error);
    }
});

// 6. DELETE /api/projects/:id
// Removes a project from the database using its primary ID key. (Secured by adminAuth)
app.delete('/api/projects/:id', adminAuth, async (req, res, next) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM projects WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Error: Project not found in the database.'
            });
        }

        console.log(`🗑️ Admin deleted project ID: ${id}`);

        res.status(200).json({
            success: true,
            message: 'Project successfully deleted from database.'
        });
    } catch (error) {
        next(error);
    }
});


// =========================================================================
// ERROR HANDLING MIDDLEWARE
// =========================================================================
// This catches any errors thrown inside route handlers and sends a clean JSON response.
// By default, Express will send HTML stacks which is a security risk.
app.use((err, req, res, next) => {
    console.error('💥 Server Error:', err.stack);
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error. Something went wrong on the server.'
    });
});


// =========================================================================
// START SERVER (Only runs locally, Vercel wraps the app in Serverless)
// =========================================================================
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running in development mode on http://localhost:${PORT}`);
    });
}

// Export the Express app for Vercel Serverless environment
module.exports = app;
