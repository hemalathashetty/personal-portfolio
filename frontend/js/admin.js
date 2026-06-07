// =========================================================================
// ADMIN CONTROL PANEL ACTIONS LOGIC (admin.js)
// =========================================================================
// Purpose: This script manages the admin login state, loads current database 
// projects inside a table list, and interfaces with the secure POST/DELETE 
// endpoints on your Express server to manage projects.
// =========================================================================

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : '/api';

// Initialize the Admin flow on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuthState();
    initAuthForm();
    initProjectForm();
    initLogout();
});

// =========================================================================
// 1. AUTH STATE CHECKER
// =========================================================================
// Purpose: Inspects localStorage to determine if the user has authenticated.
// If yes, loads the dashboard immediately.
function checkAuthState() {
    const password = localStorage.getItem('admin_password');
    const authPanel = document.getElementById('auth-panel');
    const dashboardPanel = document.getElementById('dashboard-panel');

    if (password) {
        // Authenticated: show dashboard, hide login prompt
        authPanel.classList.add('hidden');
        dashboardPanel.classList.remove('hidden');
        loadAdminProjects();
    } else {
        // Unauthenticated: show login prompt, hide dashboard
        authPanel.classList.remove('hidden');
        dashboardPanel.classList.add('hidden');
    }
}

// =========================================================================
// 2. AUTH FORM CONTROLLER
// =========================================================================
// Purpose: Collects password, saves it to localStorage, and verifies if it is
// valid by running a test request to the database projects endpoint.
function initAuthForm() {
    const authForm = document.getElementById('auth-form');
    const passwordInput = document.getElementById('admin-password');
    const authAlert = document.getElementById('auth-alert');

    if (!authForm) return;

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const pwd = passwordInput.value.trim();
        
        authAlert.className = 'alert-box alert-error hidden'; // reset alert

        try {
            // We test the password by trying to fetch the projects list.
            // (Even though GET /api/projects is public, we also have GET /api/contact which is protected, 
            // but we can query GET /api/projects as a connectivity check, or verify by sending an OPTIONS preflight).
            // Actually, to verify the password directly, we can test it by querying a GET or doing a test.
            // Let's call the backend GET /api/contact (which is a secure route) to verify!
            // If the password is correct, the secure route will return 200. If incorrect, it returns 401.
            // This is a perfect security validator!
            const response = await fetch(`${API_BASE_URL}/contact`, {
                headers: {
                    'x-admin-password': pwd
                }
            });

            if (response.status === 401) {
                throw new Error('Invalid password credentials. Access Denied.');
            }

            if (!response.ok) {
                throw new Error(`Connection issue. Status: ${response.status}`);
            }

            // Authentication succeeded!
            localStorage.setItem('admin_password', pwd);
            checkAuthState(); // Refresh visibility panels
        } catch (err) {
            authAlert.textContent = err.message || 'Authentication failed.';
            authAlert.classList.remove('hidden');
            passwordInput.value = ''; // Reset input field
        }
    });
}

// =========================================================================
// 3. LOAD CURRENT DATABASE PROJECTS
// =========================================================================
// Purpose: Requests list of projects from Express and injects table row grids.
async function loadAdminProjects() {
    const tableBody = document.getElementById('projects-table-body');
    const tableAlert = document.getElementById('table-alert');

    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Loading projects database...</td></tr>';
    tableAlert.className = 'alert-box hidden';

    try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        if (!response.ok) throw new Error('Failed to query database.');

        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
            renderAdminTable(result.data);
        } else {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No projects found in MySQL database.</td></tr>';
        }
    } catch (err) {
        console.error(err);
        tableAlert.textContent = 'Failed to load projects. Ensure the Node backend and MySQL database are online.';
        tableAlert.className = 'alert-box alert-error';
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #ff4757;">Database Offline</td></tr>';
    }
}

// Helper: Renders rows inside the admin projects list
function renderAdminTable(projectsArray) {
    const tableBody = document.getElementById('projects-table-body');
    tableBody.innerHTML = '';

    projectsArray.forEach(proj => {
        const rowHTML = `
            <tr>
                <td>
                    <img class="admin-table-img" src="${proj.image_url}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=80&q=80'" alt="">
                </td>
                <td><strong>${proj.title}</strong></td>
                <td><span style="font-size: 0.8rem; color: #00f2fe;">${proj.technologies}</span></td>
                <td>
                    <button class="btn-delete" data-id="${proj.id}">
                        <i class="fa-solid fa-trash-can"></i> Delete
                    </button>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', rowHTML);
    });

    // Attach click listeners to all generated Delete buttons
    const deleteButtons = tableBody.querySelectorAll('.btn-delete');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.getAttribute('data-id');
            deleteProject(projectId);
        });
    });
}

// =========================================================================
// 4. ADD NEW PROJECT SUBMISSION (POST /api/projects)
// =========================================================================
// Purpose: Captures data from dashboard form and posts it to Express MySQL endpoint.
function initProjectForm() {
    const form = document.getElementById('project-form');
    const formAlert = document.getElementById('form-alert');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Collect form fields
        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();
        const technologies = document.getElementById('technologies').value.trim();
        const image_url = document.getElementById('image_url').value.trim() || './assets/images/notice-system.jpg';
        const github_link = document.getElementById('github_link').value.trim();
        const demo_link = document.getElementById('demo_link').value.trim();

        const pwd = localStorage.getItem('admin_password');
        formAlert.className = 'alert-box hidden'; // reset alert

        try {
            const response = await fetch(`${API_BASE_URL}/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-password': pwd
                },
                body: JSON.stringify({ title, description, technologies, image_url, github_link, demo_link })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                formAlert.textContent = result.message || 'Project added successfully!';
                formAlert.className = 'alert-box alert-success';
                
                form.reset();         // Clear input form fields
                loadAdminProjects();  // Refresh current projects listing table
            } else {
                formAlert.textContent = result.message || 'Failed to add project.';
                formAlert.className = 'alert-box alert-error';
            }
        } catch (err) {
            formAlert.textContent = 'Server communications error: ' + err.message;
            formAlert.className = 'alert-box alert-error';
        }
    });
}

// =========================================================================
// 5. DELETE PROJECT BY ID (DELETE /api/projects/:id)
// =========================================================================
// Purpose: Prompts for confirmation and deletes the project from database.
async function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project? This will permanently remove it from the portfolio website.')) {
        return;
    }

    const tableAlert = document.getElementById('table-alert');
    const pwd = localStorage.getItem('admin_password');
    tableAlert.className = 'alert-box hidden';

    try {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
            method: 'DELETE',
            headers: {
                'x-admin-password': pwd
            }
        });

        const result = await response.json();

        if (response.ok && result.success) {
            tableAlert.textContent = result.message || 'Project deleted successfully.';
            tableAlert.className = 'alert-box alert-success';
            loadAdminProjects(); // Reload projects table
        } else {
            tableAlert.textContent = result.message || 'Failed to delete project.';
            tableAlert.className = 'alert-box alert-error';
        }
    } catch (err) {
        tableAlert.textContent = 'Server communications error: ' + err.message;
        tableAlert.className = 'alert-box alert-error';
    }
}

// =========================================================================
// 6. LOGOUT CONTROLLER
// =========================================================================
// Purpose: Clear session cookies/local storage password key and refresh to login view.
function initLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('admin_password');
        checkAuthState(); // Refresh visibility panels back to auth state
    });
}
