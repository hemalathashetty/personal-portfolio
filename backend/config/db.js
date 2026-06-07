// =========================================================================
// DATABASE CONNECTION POOL SETUP (config/db.js)
// =========================================================================
// Purpose: This file establishes a connection pool to your MySQL database.
// Why a pool? Instead of creating and destroying a new connection for every
// single API request (which is slow and resource-heavy), we create a "pool"
// of connections that Express can borrow from, use, and return instantly.
// =========================================================================

const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the .env file located one directory up
dotenv.config({ path: path.join(__dirname, '../.env') });

// Create a connection pool using the credentials from your .env file
const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
    database: process.env.DB_NAME || 'portfolio_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,   // Max connections the pool will create (prevents overloading MySQL)
    queueLimit: 0          // Unlimited queueing of requests when all connections are busy
});

// We export the promise-based wrapper of the pool.
// This allows us to use modern ES6 "async/await" when writing our database queries!
const promisePool = pool.promise();

module.exports = promisePool;
