// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        const closeMobileMenu = () => {
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Open navigation');
        };

        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const isOpen = navMenu.classList.contains('active');
            hamburger.setAttribute('aria-expanded', String(isOpen));
            hamburger.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
        });

        document.addEventListener('click', (event) => {
            if (!event.target.closest('.navbar')) closeMobileMenu();
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) closeMobileMenu();
        });
    }

    // Close menu when link is clicked
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if (hamburger) {
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.setAttribute('aria-label', 'Open navigation');
            }
        });
    });

    const currentYear = document.getElementById('currentYear');
    if (currentYear) currentYear.textContent = new Date().getFullYear();
});

// Toggle Phase Function
function togglePhase(header) {
    const content = header.nextElementSibling;
    const isOpen = content.style.display !== 'none';
    
    // Close all other phases
    document.querySelectorAll('.phase-content').forEach(phase => {
        phase.style.display = 'none';
        phase.setAttribute('aria-hidden', 'true');
    });
    document.querySelectorAll('.phase-header').forEach(h => {
        h.classList.remove('expanded');
        h.setAttribute('aria-expanded', 'false');
    });
    
    // Open clicked phase
    if (!isOpen) {
        content.style.display = 'block';
        content.setAttribute('aria-hidden', 'false');
        header.classList.add('expanded');
        header.setAttribute('aria-expanded', 'true');
    }
}

function handlePhaseKeydown(event, header) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        togglePhase(header);
    }
}

// Gallery Modal
function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const galleryItem = Array.from(document.querySelectorAll('.gallery-item')).find(item =>
        item.getAttribute('onclick')?.includes(imageSrc)
    );
    const thumbnail = galleryItem?.querySelector('img');
    modal.style.display = 'block';
    modalImage.src = thumbnail?.currentSrc || thumbnail?.src || imageSrc;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.close').focus();
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('imageModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Form Submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #10b981;
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
    `;
    successMessage.textContent = 'Thank you! Your message has been received.';
    document.body.appendChild(successMessage);
    
    // Clear form
    form.reset();
    
    // Remove message after 3 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 3000);
}

// Smooth scroll offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const element = document.querySelector(href);
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            const elementPosition = element.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature, .stat, .team-member, .video-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Add keyboard support for modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Add scroll to top button
const scrollTopButton = document.createElement('button');
scrollTopButton.innerHTML = '↑';
scrollTopButton.id = 'scrollTop';
scrollTopButton.type = 'button';
scrollTopButton.setAttribute('aria-label', 'Back to top');
scrollTopButton.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background-color: #c9853d;
    color: white;
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    display: none;
    font-size: 1.5rem;
    z-index: 999;
    transition: all 0.3s;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

document.body.appendChild(scrollTopButton);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopButton.style.display = 'flex';
        scrollTopButton.style.alignItems = 'center';
        scrollTopButton.style.justifyContent = 'center';
    } else {
        scrollTopButton.style.display = 'none';
    }
});

scrollTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollTopButton.addEventListener('mouseover', () => {
    scrollTopButton.style.backgroundColor = '#6b5537';
    scrollTopButton.style.transform = 'scale(1.1)';
});

scrollTopButton.addEventListener('mouseout', () => {
    scrollTopButton.style.backgroundColor = '#c9853d';
    scrollTopButton.style.transform = 'scale(1)';
});

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '1';
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('.gallery-item img, .team-member img').forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s';
        imageObserver.observe(img);
    });
}

// Add CSS for slide in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
