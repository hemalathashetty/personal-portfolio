# Full-Stack Personal Portfolio Website

Welcome to your production-ready, futuristic 3D Personal Portfolio Website! This project features a modern **Glassmorphism Dark Theme**, interactive **Three.js animations**, a **Node.js/Express REST API backend**, and a **MySQL database** to store and retrieve your projects and contact messages dynamically.

---

## 📂 Folder Structure

Here is a breakdown of the project directories and the purpose of each file:

```text
personal_portfolio_website/
│
├── database/
│   └── schema.sql              # SQL queries to create the database, tables, and seed projects
│
├── backend/
│   ├── config/
│   │   └── db.js               # Connects Express to MySQL using connection pools
│   ├── .env                    # Local database credentials (ignored by git for security)
│   ├── .env.example            # Template for environment configurations
│   ├── package.json            # Node.js dependencies and run scripts
│   └── server.js               # Main server file defining APIs and routing logic
│
├── frontend/
│   ├── css/
│   │   └── style.css           # Glassmorphism and futuristic dark theme stylesheet
│   ├── js/
│   │   ├── main.js             # Form validation, dynamic fetching, page scroll effects
│   │   └── three-bg.js         # Interactive Three.js particle field and 3D floating object
│   ├── assets/
│   │   ├── resume.pdf          # Placeholder file for your downloadable resume
│   │   └── images/             # Cover graphics for projects (loaded dynamically)
│   └── index.html              # Main HTML markup structuring the portfolio sections
│
└── README.md                   # This instruction manual
```

---

## 🛠️ Step 1: Software Installation

Before running the website, install the following tools on your local computer:

1.  **Node.js**:
    *   **What it does**: Runs the backend server code on your computer.
    *   **How to install**: Go to [nodejs.org](https://nodejs.org/), download the **LTS (Long Term Support)** version, and run the installer.
2.  **MySQL Database & Workbench**:
    *   **What it does**: Stores project data and visitor messages in structured tables.
    *   **How to install**: Go to [dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/). Download and run the **MySQL Installer**. Select **Developer Default** (includes MySQL Server and MySQL Workbench). Create a strong **root password** during installation (e.g. `password` or similar) and remember it.
3.  **Git (Optional but recommended)**:
    *   **What it does**: Manages project code history.
    *   **How to install**: Download from [git-scm.com](https://git-scm.com/).

---

## 🗄️ Step 2: Database Creation and Table Setup

1.  Open **MySQL Workbench** on your machine.
2.  Connect to your local MySQL instance (default user is `root`, port `3306`). Enter the password you set during installation.
3.  Click the **Open SQL Script** icon (or go to `File -> Open SQL Script...`) and load the script:
    `database/schema.sql` (located in the project folder).
4.  Click the **Lightning Bolt icon** to execute the script.
    *   **What this does**:
        *   Creates a database named `portfolio_db`.
        *   Creates a `projects` table (stores titles, images, and description).
        *   Creates a `contact` table (stores emails and contact requests).
        *   Inserts (seeds) 4 default engineering projects so the website isn't empty!

---

## 💻 Step 3: Local Configuration & Installation

1.  Open your command terminal (Command Prompt, Git Bash, or VS Code terminal).
2.  Navigate to the `backend/` directory:
    ```bash
    cd backend
    ```
3.  Install backend dependencies:
    ```bash
    npm install
    ```
    *   **What this installs**:
        *   `express`: The framework that receives browser requests and returns responses.
        *   `mysql2`: The driver that allows Node.js to execute queries on your MySQL database.
        *   `dotenv`: Safely loads database passwords from `.env`.
        *   `cors`: Connects your frontend domain/port to your backend port.
        *   `nodemon` (development tool): Restarts the server automatically every time you edit your backend files!
4.  Configure environment variables:
    *   Rename the file `.env.example` in the `backend/` folder to `.env`.
    *   Open `.env` in a text editor and enter your database details:
        ```env
        PORT=5000
        DB_HOST=127.0.0.1
        DB_PORT=3306
        DB_USER=root
        DB_PASSWORD=your_mysql_root_password
        DB_NAME=portfolio_db
        ```

---

## 🚀 Step 4: Running the Application Locally

### 1. Start the Backend Server
1.  In your terminal (inside the `backend` folder), run:
    ```bash
    npm run dev
    ```
2.  If credentials are correct, you will see:
    ```text
    🚀 Server running in development mode on http://localhost:5000
    ✅ Connected to MySQL database successfully!
    ```
3.  Open `http://localhost:5000/api/projects` in your browser. You should see your project details load as structured JSON data.

### 2. Run the Frontend
1.  Because this project uses plain Vanilla HTML, CSS, and JS, you can open the file `frontend/index.html` directly in your browser.
2.  **Recommended for Development**: Use a VS Code extension like **Live Server** to host the frontend at `http://127.0.0.1:5500`. This ensures all Three.js elements and fetch API requests load smoothly without security policies blockages.
3.  The frontend will automatically communicate with the backend:
    *   **Project Cards**: Loaded dynamically from MySQL using JavaScript's `fetch()` API (`GET /api/projects`).
    *   **Contact Form**: When filled out, sends data via `fetch()` (`POST /api/contact`) and stores it securely in MySQL.

---

## ⚙️ How Frontend & Backend Communicate

1.  **Frontend to Backend Connection**:
    Inside [main.js](file:///c:/Users/Hemalatha/OneDrive/Desktop/personal_portfolio_website/frontend/js/main.js), we trigger a call:
    ```javascript
    const response = await fetch('http://localhost:5000/api/projects');
    const data = await response.json();
    ```
    This sends an asynchronous HTTP request to the Express server.
2.  **Backend to Database Connection**:
    Inside [server.js](file:///c:/Users/Hemalatha/OneDrive/Desktop/personal_portfolio_website/backend/server.js), Express catches the request and queries MySQL using:
    ```javascript
    const [rows] = await db.query('SELECT * FROM projects');
    res.status(200).json({ success: true, data: rows });
    ```
    It returns this data back to the frontend in a structured JSON package. The frontend then loops through the array and builds cards dynamically using DOM manipulation.

---

## ☁️ Step 5: Deployment Guide (Production Setup)

When ready to show this website to recruiters or friends, deploy it to the cloud.

### 1. Deploy the Database (MySQL)
Free local databases won't work on the internet. You must host your MySQL database online:
*   **Host**: Use platforms like **Aiven**, **Railway**, or **Tidb Cloud** to set up a free managed MySQL cluster database.
*   **Actions**: Once created, copy the database credentials URI and run your `database/schema.sql` code in their console/CLI to create the tables.

### 2. Host the Backend Server (Express)
*   **Platform**: Deploy your server code on **Render** (free tier), **Railway**, or **Heroku**.
*   **Steps**:
    1.  Push the project code to a public GitHub repository.
    2.  Link the repository to Render (select Web Service).
    3.  Set the Root Directory to `backend`.
    4.  Set the Build Command to `npm install`.
    5.  Set the Start Command to `npm start`.
    6.  In **Environment Variables**, add:
        *   `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` matching your hosted database credentials.
        *   `PORT=10000` (Render allocates this automatically).

### 3. Host the Frontend (HTML/CSS/JS)
*   **Platform**: Host the client files on **Vercel**, **Netlify**, or **GitHub Pages**.
*   **Steps**:
    1.  Link your repository to Netlify/Vercel.
    2.  Set the Root Directory of the deployment to `frontend`.
    3.  Leave build commands empty (since it's static HTML).
    4.  Click **Deploy**.
    5.  **Important**: Open [main.js](file:///c:/Users/Hemalatha/OneDrive/Desktop/personal_portfolio_website/frontend/js/main.js) and change `API_BASE_URL` from `http://localhost:5000/api` to your deployed backend URL on Render (e.g. `https://portfolio-backend.onrender.com/api`).

---

## 🛠️ Common Errors and Troubleshooting

### 1. `CORS Error` in Console
*   **Why**: The browser blocks requests if the frontend domain doesn't match the backend.
*   **Fix**: Ensure `cors()` is configured correctly in `backend/server.js`.

### 2. `ECONNREFUSED` or Database connection failed
*   **Why**: Node.js cannot find the MySQL database.
*   **Fix**:
    1.  Verify MySQL is actively running on your machine.
    2.  Check that the credentials, host, and port in `backend/.env` exactly match your local MySQL configuration.

### 3. `Three.js` canvas is blank
*   **Why**: Three.js library CDN did not load, or canvas selector is wrong.
*   **Fix**: Ensure you have an active internet connection to load the Three.js library CDN link inside `index.html`. Check your browser developer tools console (F12) for syntax errors in `three-bg.js`.
