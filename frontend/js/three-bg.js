// =========================================================================
// THREE.JS 3D BACKGROUND AND PARTICLES ANIMATION (three-bg.js)
// =========================================================================
// Purpose: This script initializes a 3D environment behind your website pages.
// It creates a floating particle field (stars) that rotates slowly.
// =========================================================================

// Declare global variables for our 3D ecosystem
let scene, camera, renderer;
let particleSystem;

// Initialize the 3D scene
function init3D() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    // 1. CREATE THE SCENE
    // The scene holds all 3D objects, lights, cameras, and particle fields.
    scene = new THREE.Scene();

    // 2. CREATE THE CAMERA
    // Parameters: Field of view (60 degrees), Aspect ratio, Near clipping plane (0.1), Far clipping plane (1000)
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8; // Pull the camera back so we can view the objects

    // 3. CREATE THE RENDERER
    // Configures drawing on the HTML5 canvas, enabling smooth edges (antialias) and transparent background (alpha)
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio to 2 for performance optimization

    // 4. CREATE THE 3D PARTICLE FIELD (STARS)
    createParticleField();

    // 5. EVENT LISTENERS
    window.addEventListener('resize', onWindowResize);

    // Start the animation render loop
    animate();
}

// Function to generate the floating particle (star) network
function createParticleField() {
    const particleCount = 1500; // Increased count for richer background since central object is removed
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3); // x, y, z for each particle

    // Fill positions array with random coordinates in 3D space
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 35;     // X coordinate
        positions[i + 1] = (Math.random() - 0.5) * 35; // Y coordinate
        positions[i + 2] = (Math.random() - 0.5) * 35; // Z coordinate
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle styling (color, size, texture)
    const material = new THREE.PointsMaterial({
        color: 0x00f2fe,                // Cyan glow
        size: 0.05,                     // Slightly larger star size
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending // Blending makes overlapping particles brighter
    });

    // Create the particle system points object and add it to the scene
    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

// Handle window resizing to keep the 3D canvas responsive
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// The render loop running at 60 FPS (or browser refresh rate)
function animate() {
    requestAnimationFrame(animate);

    // Slow, auto-rotating animations for particles
    if (particleSystem) {
        particleSystem.rotation.y += 0.0006;
        particleSystem.rotation.x += 0.0002;
    }

    // Render the updated camera and scene angles on canvas
    renderer.render(scene, camera);
}

// Initialize the 3D script when the document content is fully parsed
document.addEventListener('DOMContentLoaded', init3D);
