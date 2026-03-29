// Typing Effect removed for new layout

// Background Animation (Floating Icons)
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Cryptography, Security, and SOC icons
const icons = [
    '\uf3ed', // Shield
    '\uf023', // Lock
    '\uf13e', // Unlock
    '\uf084', // Key
    '\uf577', // Fingerprint
    '\uf21b', // User Secret (Hacker)
    '\uf2db', // Microchip
    '\uf1c0', // Database
    '\uf233', // Server
    '\uf121'  // Code
];
const particles = [];

// Mouse interaction tracking
const mouse = {
    x: undefined,
    y: undefined,
    radius: 120 // Distance at which icons react
};

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', function() {
    mouse.x = undefined;
    mouse.y = undefined;
});

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.size = Math.random() * 20 + 20;
        this.speedY = Math.random() * 1 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.icon = icons[Math.floor(Math.random() * icons.length)];
        this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
        // Natural floating movement
        this.y -= this.speedY;
        this.x += this.speedX;
        
        // Mouse reactivity
        if (mouse.x !== undefined && mouse.y !== undefined) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                // Calculate push force based on proximity
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                
                const force = (mouse.radius - distance) / mouse.radius;
                
                // Direction multiplier (Push away)
                const pushX = forceDirectionX * force * 5;
                const pushY = forceDirectionY * force * 5;
                
                this.x -= pushX;
                this.y -= pushY;
            }
        }
        
        // Reset if moved out of top bound
        if (this.y < -100) this.reset();
        
        // Handle side screen wrapping for extreme left/right pushes
        if (this.x < -100) this.x = canvas.width + 50;
        if (this.x > canvas.width + 100) this.x = -50;
    }

    draw() {
        ctx.font = `900 ${this.size}px "Font Awesome 6 Free"`;
        ctx.fillStyle = `rgba(225, 29, 72, ${this.opacity})`;
        ctx.fillText(this.icon, this.x, this.y);
    }
}

function initParticles() {
    for (let i = 0; i < 20; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

// Scroll Reveal
const revealElements = document.querySelectorAll('[data-reveal]');
const revealOnScroll = () => {
    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
            el.classList.add('active');
        }
    });
};

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Resize Handler
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Init
window.addEventListener('DOMContentLoaded', () => {
    // Wait for fonts to load before starting canvas to avoid "X" boxes
    document.fonts.ready.then(() => {
        initParticles();
        animate();
    });

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // Mobile Menu Toggle
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // EmailJS Form Handling
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        // Initialize EmailJS Globally
        emailjs.init({
            publicKey: 'X-lepjhCWsk2MHYU2',
        });

        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // EmailJS credentials
            const serviceID = 'service_jeoli0e';
            const templateID = 'template_rznjxu8';
            
            // Call EmailJS sendForm
            emailjs.sendForm(serviceID, templateID, contactForm)
                .then((response) => {
                    console.log('SUCCESS!', response.status, response.text);
                    formStatus.style.display = 'block';
                    formStatus.style.color = 'var(--success)'; // Green success
                    formStatus.textContent = 'Message sent successfully! I will reach out soon.';
                    contactForm.reset();
                }, (error) => {
                    console.error('FAILED...', error);
                    formStatus.style.display = 'block';
                    formStatus.style.color = '#ff4444'; // Red error text
                    formStatus.textContent = `Failed to send. Error: ${error.text || error.message || 'Check console'}`;
                })
                .finally(() => {
                    // Restore button state
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    
                    // Hide status text after 5 seconds
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                    }, 5000);
                });
        });
    }
});
