// =========================================================================
// MAIN FRONTEND APPLICATION LOGIC (main.js)
// =========================================================================
// Purpose: This script manages UI interactions, active link highlighting on
// scroll, progress bar animations, 3D tilt effects, fetching projects from
// the Express backend, and submitting contact messages.
// =========================================================================

// Config: Backend URL endpoint (change to live server address when deployed)
const API_BASE_URL = 'http://localhost:5000/api';

// Static fallback data: If database is disconnected, we show these projects
// so the UI never displays empty blocks or breaks for users.
const FALLBACK_PROJECTS = [
    {
        id: 1,
        title: "Notice Management System",
        description: "Developed a web-based notice management platform. Students can view notices relevant to their department, class, or category. Improved communication and accessibility of academic announcements.",
        technologies: "HTML5, CSS3, JavaScript, Node.js, Express, MySQL",
        image_url: "./assets/images/notice-system.jpg",
        github_link: "https://github.com/hemalatha-shetty/notice-management-system",
        demo_link: "https://notice-system-demo.example.com"
    },
    {
        id: 2,
        title: "Student Result Management System",
        description: "Built a system to manage and display student academic results. Allows efficient storage, retrieval, and management of result data. Implemented database integration for secure record management.",
        technologies: "HTML5, CSS3, JavaScript, Java, Spring Boot, MySQL",
        image_url: "./assets/images/result-system.jpg",
        github_link: "https://github.com/hemalatha-shetty/student-result-system",
        demo_link: "https://result-system-demo.example.com"
    },
    {
        id: 3,
        title: "Smart Light and Fan Control System",
        description: "Developed an IoT-based system to control light brightness and fan speed. Used ESP32 and web-based controls for remote operation. Improved energy efficiency and user convenience.",
        technologies: "ESP32, Arduino, WebSockets, HTML5, CSS3, JavaScript",
        image_url: "./assets/images/smart-home.jpg",
        github_link: "https://github.com/hemalatha-shetty/smart-home-control",
        demo_link: "https://smart-home-demo.example.com"
    }
];

// Initialize application modules when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollTracker();
    initSkillBarsObserver();
    initTiltEffect();
    fetchProjects();
    initContactForm();
});

// =========================================================================
// 1. MOBILE NAVIGATION MENU
// =========================================================================
// Purpose: Toggles the mobile dropdown navigation drawer when the burger menu is clicked.
function initNavbar() {
    const menuBtn = document.getElementById('menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const navLinks = mobileNav.querySelectorAll('a');

    // Add click event listener to menu button
    menuBtn.addEventListener('click', () => {
        // Toggle mobile drawer visibility
        mobileNav.classList.toggle('open');
        // Transform hamburger menu bars into a 'Close (X)' shape via CSS transitions
        menuBtn.classList.toggle('active');
    });

    // Close navigation drawer when clicking any link inside it
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            menuBtn.classList.remove('active');
        });
    });
}

// =========================================================================
// 2. ACTIVE NAVIGATION LINK TRACKER
// =========================================================================
// Purpose: Highlights the correct navigation tab based on the active viewport.
function initScrollTracker() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // Offset for header navbar height

        // Add visual blur background to navbar when scrolling down the page
        if (window.scrollY > 50) {
            header.style.padding = '12px 8%';
            header.style.background = 'rgba(7, 7, 20, 0.85)';
        } else {
            header.style.padding = '20px 8%';
            header.style.background = 'rgba(7, 7, 20, 0.65)';
        }

        // Detect which section is currently under the user's viewport
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Set active styling on matching navigation link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

// =========================================================================
// 3. SKILL BARS & TIMELINE SCROLL TRIGGER ANIMATIONS
// =========================================================================
// Purpose: Triggers progress bar animations and timeline reveals as they scroll into view.
function initSkillBarsObserver() {
    const skillBars = document.querySelectorAll('.progress-bar');

    // Intersection Observer looks for when elements enter the screen viewport
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If it's a progress bar, animate its width from 0 to its target percentage
                if (entry.target.classList.contains('progress-bar')) {
                    const targetWidth = entry.target.getAttribute('data-width');
                    entry.target.style.width = targetWidth;
                }
                
                // Stop observing this element once animated to save GPU performance
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15 // Triggers when 15% of the element is visible on screen
    });

    // Register elements to the observer
    skillBars.forEach(bar => animationObserver.observe(bar));
}

// =========================================================================
// 4. INTERACTIVE 3D TILT EFFECT FOR CARDS (Custom Vanilla Logic)
// =========================================================================
// Purpose: Adds a 3D parallax tilt angle to skill cards when hovering over them.
function initTiltEffect() {
    const cards = document.querySelectorAll('[data-tilt]');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            // Calculate absolute position coordinates of mouse relative to card boundary
            const x = e.clientX - cardRect.left;
            const y = e.clientY - cardRect.top;

            // Normalize coordinate offsets relative to center of card
            const midX = cardRect.width / 2;
            const midY = cardRect.height / 2;

            // Maximum tilt angle (in degrees)
            const maxTilt = 8;
            
            // Calculate rotation degrees based on proximity to edges
            const rotateX = ((midY - y) / midY) * maxTilt;
            const rotateY = ((x - midX) / midX) * maxTilt;

            // Apply transformations
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        // Reset positions when mouse leaves card boundary
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
}

// =========================================================================
// 5. PROJECTS DATA FETCHING (GET /api/projects)
// =========================================================================
// Purpose: Fetches your software engineering projects from the MySQL database
// and renders them dynamically inside CSS cards.
async function fetchProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    const loader = document.getElementById('projects-loader');

    try {
        // Send async HTTP request to Express backend API
        const response = await fetch(`${API_BASE_URL}/projects`);
        
        if (!response.ok) {
            throw new Error(`Server returned HTTP status ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
            renderProjects(data.data);
        } else {
            console.warn('API returned success but empty projects list. Falling back to local data.');
            renderProjects(FALLBACK_PROJECTS);
        }
    } catch (error) {
        console.error('Failed to communicate with MySQL backend:', error.message);
        console.log('Loading local fallback mock projects to preserve UI layout.');
        
        // Fail-safe operation: Render hardcoded projects if database server is offline
        renderProjects(FALLBACK_PROJECTS);
    } finally {
        // Remove loading spinner from the screen
        if (loader) {
            loader.classList.add('hidden');
        }
    }
}

// Helper function to build project cards markup
function renderProjects(projectsArray) {
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = ''; // Clear existing contents

    projectsArray.forEach(proj => {
        // Split comma-separated string of technologies into an array of badges
        const tagsMarkup = proj.technologies.split(',')
            .map(tech => `<span class="tag-badge">${tech.trim()}</span>`)
            .join('');

        // Generate full template literal structure for card
        const cardHTML = `
            <div class="glass-card project-card">
                <div class="project-img">
                    <!-- If project image path doesn't exist, we load a placeholder graphic -->
                    <img src="${proj.image_url}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500&q=80'" alt="${proj.title}">
                    <div class="project-overlay"></div>
                </div>
                <div class="project-body">
                    <h3>${proj.title}</h3>
                    <p>${proj.description}</p>
                    <div class="project-tags">
                        ${tagsMarkup}
                    </div>
                    <div class="project-links">
                        <a href="${proj.github_link}" target="_blank" class="project-link">
                            <i class="fa-brands fa-github"></i> Source Code
                        </a>
                        ${proj.demo_link ? `
                        <a href="${proj.demo_link}" target="_blank" class="project-link">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo
                        </a>` : ''}
                    </div>
                </div>
            </div>
        `;
        // Inject card directly into HTML grid DOM element
        projectsGrid.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// =========================================================================
// 6. CONTACT FORM SUBMISSION (POST /api/contact)
// =========================================================================
// Purpose: Captures data from user form, sanitizes and sends it via JSON
// payload to Node.js backend. Displays success or error dialog alert notifications.
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const alertBox = document.getElementById('contact-alert');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Block standard browser reload behavior on submit

        // Collect inputs from inputs
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Show submitting state on submit button
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';

        // Reset alert box visibility
        alertBox.className = 'alert-box hidden';

        try {
            // Send JSON post request payload to backend
            const response = await fetch(`${API_BASE_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, subject, message })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Success message
                alertBox.textContent = result.message || 'Your message has been sent successfully!';
                alertBox.className = 'alert-box alert-success';
                
                // Clear form inputs
                contactForm.reset();
            } else {
                // Server validation error
                alertBox.textContent = result.message || 'Error occurred. Please try again.';
                alertBox.className = 'alert-box alert-error';
            }
        } catch (error) {
            console.error('Failed to submit contact message to backend:', error.message);
            // System communication error (Server is offline)
            alertBox.textContent = 'Oops! The server seems offline. Please try again later or email me directly.';
            alertBox.className = 'alert-box alert-error';
        } finally {
            // Restore button styling
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
        }
    });
}
