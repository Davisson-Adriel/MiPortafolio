// Portfolio JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initSkillBars();
    initContactForm();
    initTypeWriter();
    initParallax();
    initCarousel();
    initCopyEmail();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for styling
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Active nav link highlighting
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Check if element has already been animated
                if (entry.target.hasAttribute('data-observed')) {
                    return;
                }
                
                // Mark as observed to prevent re-execution
                entry.target.setAttribute('data-observed', 'true');
                
                entry.target.style.animationDelay = '0.2s';
                entry.target.style.animationFillMode = 'both';
                entry.target.style.animation = 'fadeInUp 0.8s ease-out';
                
                // Trigger skill bars animation when skills section is visible
                if (entry.target.classList.contains('skills')) {
                    animateSkillBars();
                }
                
                // Trigger counter animation for stats
                if (entry.target.classList.contains('about-stats')) {
                    animateCounters();
                }
                
                // Stop observing this element after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.project-card, .skill-category, .about-content, .contact-content, .about-stats, .carousel-container');
    animatedElements.forEach(el => observer.observe(el));
}

// Skill bars animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    
    skillBars.forEach(bar => {
        const level = bar.getAttribute('data-level');
        bar.style.width = '0%';
    });
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    
    skillBars.forEach((bar, index) => {
        // Check if animation has already been executed
        if (bar.hasAttribute('data-animated')) {
            return;
        }
        
        // Mark as animated to prevent re-execution
        bar.setAttribute('data-animated', 'true');
        
        const level = bar.getAttribute('data-level');
        setTimeout(() => {
            bar.style.width = level + '%';
        }, index * 200);
    });
}

// Counter animation for statistics
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        // Check if animation has already been executed
        if (counter.hasAttribute('data-animated')) {
            return;
        }
        
        // Mark as animated to prevent re-execution
        counter.setAttribute('data-animated', 'true');
        
        const target = parseInt(counter.textContent);
        const increment = target / 60; // Animation duration
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current) + '+';
        }, 50);
    });
}

// Typewriter effect for hero section
function initTypeWriter() {
    const titles = [
        'Desarrollador Fullstack Junior',
        'Creador de Experiencias Web',
        'Solucionador de Problemas'
    ];
    
    const titleElement = document.querySelector('.hero-title');
    if (!titleElement) return;
    
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeWriter() {
        const currentTitle = titles[titleIndex];
        
        if (!isDeleting) {
            titleElement.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentTitle.length) {
                setTimeout(() => isDeleting = true, 2000);
            }
        } else {
            titleElement.textContent = currentTitle.substring(0, charIndex);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                titleIndex = (titleIndex + 1) % titles.length;
            }
        }
        
        const typingSpeed = isDeleting ? 50 : 100;
        setTimeout(typeWriter, typingSpeed);
    }
    
    // Start typewriter effect after initial load
    setTimeout(typeWriter, 1000);
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Simple form validation
        if (!name || !email || !subject || !message) {
            showNotification('Por favor, completa todos los campos.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Por favor, ingresa un email válido.', 'error');
            return;
        }
        
        // Send message to WhatsApp
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="bi bi-whatsapp"></i> Redirigiendo...';
        submitBtn.disabled = true;
        
        // Create WhatsApp message
        const whatsappMessage = `
¡Hola! Me contacto desde tu portafolio web 👋

*Nombre:* ${name}
*Email:* ${email}
*Asunto:* ${subject}

*Mensaje:*
${message}

---
Enviado desde: tu-portafolio.com
        `.trim();
        
        // Your WhatsApp number (replace with your actual number)
        // Format: country code + number (without + symbol)
        // Colombia: +57 + 350 406 2046 = 573504062046
        const whatsappNumber = '573504062046';
        
        // Create WhatsApp URL
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        
        setTimeout(() => {
            // Open WhatsApp in new tab
            window.open(whatsappURL, '_blank');
            
            // Show success message
            showNotification('¡Redirigiendo a WhatsApp! Tu mensaje está prellenado.', 'success');
            
            // Reset form
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Reset form labels
            const labels = contactForm.querySelectorAll('label');
            labels.forEach(label => {
                label.style.top = '';
                label.style.fontSize = '';
                label.style.color = '';
            });
        }, 1500);
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="bi bi-x"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
        max-width: 400px;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.75rem;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 1.25rem;
        margin-left: auto;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Parallax effect disabled - keeping hero section static
function initParallax() {
    // Parallax effect removed to prevent overlay issues
    // Hero section will remain static
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            // Close mobile menu if open
            const navMenu = document.getElementById('nav-menu');
            const navToggle = document.getElementById('nav-toggle');
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            
            // Simple scroll calculation
            const offsetTop = targetElement.offsetTop - 80;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
});

// Loading animation
window.addEventListener('load', function() {
    // Hide loading screen if exists
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }
    
    // Trigger entrance animations
    const heroElements = document.querySelectorAll('.hero-greeting, .hero-name, .hero-title, .hero-description, .hero-buttons, .hero-social');
    heroElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.2}s`;
        element.classList.add('animate-in');
    });
});

// Theme toggle (bonus feature)
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update toggle icon
        const icon = themeToggle.querySelector('i');
        icon.className = newTheme === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
    });
}

// Mouse cursor effect (optional enhancement)
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: var(--primary-color);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: all 0.1s ease;
        opacity: 0;
    `;
    
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursor.style.opacity = '0.7';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '0.7';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    // Hover effects
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.background = 'var(--accent-color)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.background = 'var(--primary-color)';
        });
    });
}

// Initialize custom cursor on desktop only
if (window.innerWidth > 768) {
    initCustomCursor();
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScroll = debounce(() => {
    // Any scroll-based animations or calculations
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Skip to main content with Tab key
    if (e.key === 'Tab' && !e.shiftKey) {
        const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
        // Ensure proper tab order and focus management
    }
    
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Gallery Carousel functionality
function initCarousel() {
    const carousel = document.getElementById('carousel-slides');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    
    if (!carousel || !slides.length) return;
    
    let currentSlide = 0;
    let isTransitioning = false;
    
    function updateCarousel() {
        if (isTransitioning) return;
        isTransitioning = true;
        
        // Update slides
        carousel.style.transform = `translateX(-${currentSlide * 20}%)`;
        
        // Update active states
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateCarousel();
    }
    
    function goToSlide(index) {
        if (index !== currentSlide && !isTransitioning) {
            currentSlide = index;
            updateCarousel();
        }
    }
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Auto-play carousel
    let autoPlayInterval = setInterval(nextSlide, 5000);
    
    // Pause auto-play on hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(nextSlide, 5000);
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
    
    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        carouselContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        });
    }
    
    // Initialize first slide
    updateCarousel();
}

// Copy Email functionality
function initCopyEmail() {
    const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
    
    copyEmailBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const email = 'droman819@unab.edu.co';
            
            try {
                await navigator.clipboard.writeText(email);
                showNotification('¡Correo copiado: ' + email + '!', 'success');
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = email;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    showNotification('¡Correo copiado: ' + email + '!', 'success');
                } catch (err) {
                    showNotification('No se pudo copiar el correo. Email: ' + email, 'error');
                }
                
                document.body.removeChild(textArea);
            }
        });
    });
}

// Console message for developers
console.log(`
🚀 Portafolio desarrollado con:
- HTML5 semántico
- CSS3 con variables personalizadas
- JavaScript vanilla optimizado
- Diseño responsive
- Animaciones fluidas
- Funcionalidad de copiado de email
- Mejores prácticas de accesibilidad

Desarrollado por: Davisson Adriel Roman Carreño
Contacto: droman819@unab.edu.co
`);

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        showNotification,
        debounce
    };
}