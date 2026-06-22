/* ==========================================
   MAIN JAVASCRIPT - Global Functions
========================================== */

// Navbar Scroll Effect
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar-modern');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 80) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
});

// Scroll Animations (Intersection Observer)
const animateElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Trigger any inner highlight reveal
                const highlight = entry.target.querySelector('.highlight.reveal');
                if (highlight) highlight.classList.add('reveal');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-up, .fade-left, .fade-right, .scale-in, .counter-box, .card-glass, .circle-counter, .testi-card, .card-glass, .contact-card-custom').forEach(el => {
        if (!el.classList.contains('visible')) {
            observer.observe(el);
        }
    });

    // Observe section titles for highlight underline
    document.querySelectorAll('.section-title .highlight').forEach(el => {
        const parentSection = el.closest('section') || el.closest('.section-modern');
        if (parentSection) {
            const obs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        el.classList.add('reveal');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            obs.observe(parentSection);
        }
    });
};

document.addEventListener('DOMContentLoaded', animateElements);

// Scroll to Top Button
document.addEventListener('DOMContentLoaded', () => {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-top';
    scrollBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Circle Counters Animation
const animateCircleCounters = () => {
    document.querySelectorAll('.circle-counter').forEach(counter => {
        const circle = counter.querySelector('.progress-circle');
        const valueEl = counter.querySelector('.ring-text span');
        if (!circle || !valueEl) return;

        const target = parseInt(valueEl.dataset.target);
        const circumference = 283;
        const offset = circumference - (target / 100) * circumference;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    circle.style.strokeDashoffset = offset;
                    animateValue(valueEl, 0, target, 2000);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(counter);
    });
};

document.addEventListener('DOMContentLoaded', animateCircleCounters);

// Simple Counter Animation
function animateValue(el, start, end, duration) {
    if (!el) return;
    const range = end - start;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + range * eased);
        const suffix = el.hasAttribute('data-suffix') ? el.dataset.suffix : '+';
        el.textContent = current + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = end + suffix;
        }
    }

    requestAnimationFrame(update);
}

// Number Counters
const initCounters = () => {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                const suffix = el.dataset.suffix || '+';
                animateValue(el, 0, target, 2500);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter-num[data-target]').forEach(el => {
        counterObserver.observe(el);
    });
};

document.addEventListener('DOMContentLoaded', initCounters);

// Typewriter Effect
const typeWriter = (element, text, speed = 80) => {
    if (!element) return;
    let i = 0;
    element.textContent = '';
    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
};

document.addEventListener('DOMContentLoaded', () => {
    const typewriterEl = document.querySelector('.typewriter');
    if (typewriterEl) {
        typeWriter(typewriterEl, typewriterEl.dataset.text || 'Photography', 80);
    }
});

// Newsletter Form
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.newsletter-form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const original = btn.textContent;
            btn.textContent = 'Subscribed!';
            btn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            form.querySelector('input').value = '';
            setTimeout(() => {
                btn.textContent = original;
                btn.style.background = '';
            }, 3000);
        });
    });
});

// Smooth Scroll for anchor links
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

// Parallax Effect on hero backgrounds
const initParallax = () => {
    const parallaxElements = document.querySelectorAll('.hero-bg, .hero-bg-img, .auth-bg');
    if (parallaxElements.length === 0) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.pageYOffset;
                parallaxElements.forEach(el => {
                    const speed = 0.3;
                    const parent = el.closest('.hero-modern, .page-hero, .auth-page');
                    if (parent) {
                        const rect = parent.getBoundingClientRect();
                        if (rect.bottom > 0 && rect.top < window.innerHeight) {
                            const offset = scrollY * speed;
                            el.style.transform = `translateY(${offset}px)`;
                        }
                    }
                });
                ticking = false;
            });
            ticking = true;
        }
    });
};

document.addEventListener('DOMContentLoaded', initParallax);

// ==========================================
// MOBILE NAV TOGGLER ACTIVE STATE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const navMain = document.getElementById('navMain');
    const toggler = document.querySelector('.navbar-modern .navbar-toggler');
    if (!navMain || !toggler) return;
    navMain.addEventListener('show.bs.collapse', () => toggler.classList.add('active'));
    navMain.addEventListener('hide.bs.collapse', () => toggler.classList.remove('active'));
});

// ==========================================
// LOGIN STATE - Update Navbar
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('lensflare_user');
    const role = localStorage.getItem('lensflare_role');
    const navButtons = document.querySelector('.navbar-modern .nav-buttons');
    if (userName && navButtons) {
        const initial = userName.charAt(0).toUpperCase();
        const dashLinks = { admin: 'dashboard.html', photographer: 'dash-photographer.html', customer: 'dash-customer.html' };
        const dashUrl = dashLinks[role] || 'dashboard.html';
        navButtons.innerHTML = `
            <a href="${dashUrl}" class="btn nav-btn nav-btn-primary" style="display:inline-flex;align-items:center;gap:8px;padding:8px 18px;">
                <span style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;">${initial}</span>
                Dashboard
            </a>
        `;
    }
});


