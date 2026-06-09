// ============================================
// HOZA.DEV — Interactive Features
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSmoothScroll();
    initNavHighlight();
    initNavScroll();
    initScrollReveal();
    initCounterAnimation();
    initFormHandling();
    initTypingEffect();
    initCookieConsent();
    initEscapeHandler();
});

// Mobile Menu
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navRight = document.querySelector('.nav-right');
    if (!menuBtn || !navRight) return;

    function closeMenu() {
        menuBtn.classList.remove('active');
        navRight.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Otevřít menu');
    }

    function openMenu() {
        menuBtn.classList.add('active');
        navRight.classList.add('active');
        menuBtn.setAttribute('aria-expanded', 'true');
        menuBtn.setAttribute('aria-label', 'Zavřít menu');
    }

    menuBtn.addEventListener('click', () => {
        const isOpen = menuBtn.classList.contains('active');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    navRight.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav')) {
            closeMenu();
        }
    });
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Active Nav Highlight
function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

    sections.forEach(section => observer.observe(section));
}

// Navbar scroll state
function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    const update = () => {
        if (window.scrollY > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
}

// Scroll Reveal Animation
function initScrollReveal() {
    const elements = document.querySelectorAll(
        '.service-card, .process-step, .project-card, .testimonial, .section-intro, .contact-info, .contact-form, .retainer-card, .about-grid, .services-fintech, .services-retainers, .calendly-cta'
    );
    if (!elements.length) return;

    elements.forEach(el => {
        el.classList.add('reveal');
    });

    const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        visible.forEach((entry, i) => {
            setTimeout(() => {
                entry.target.classList.add('revealed');
            }, i * 80);
            observer.unobserve(entry.target);
        });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}

// Counter Animation for Stats
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'), 10);
                animateCounter(el, target);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el, target) {
    const duration = 1800;
    const start = performance.now();

    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.round(easeOutQuart(progress) * target);
        el.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(tick);
        }
    }

    requestAnimationFrame(tick);
}

// Typing Effect for Code Window
function initTypingEffect() {
    const codeContent = document.querySelector('.terminal-code code');
    if (!codeContent) return;

    const originalHTML = codeContent.innerHTML;
    let hasRun = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasRun) {
                hasRun = true;
                codeContent.innerHTML = '';
                typeWriter(codeContent, originalHTML, 0, 18);
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });

    observer.observe(codeContent.closest('.card-terminal'));
}

function typeWriter(element, html, index, speed) {
    if (index >= html.length) return;

    if (html[index] === '<') {
        const endIndex = html.indexOf('>', index);
        if (endIndex === -1) return;
        element.innerHTML += html.substring(index, endIndex + 1);
        setTimeout(() => typeWriter(element, html, endIndex + 1, speed), speed);
    } else {
        element.innerHTML += html[index];
        setTimeout(() => typeWriter(element, html, index + 1, speed), speed);
    }
}

// Form Handling — Web3Forms
function initFormHandling() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Client-side validation
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.setAttribute('aria-invalid', 'true');
                isValid = false;
            } else {
                field.removeAttribute('aria-invalid');
            }
        });

        const emailField = form.querySelector('#email');
        if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
            emailField.setAttribute('aria-invalid', 'true');
            isValid = false;
        }

        if (!isValid) {
            showNotification('Vyplňte prosím všechna povinná pole.', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const btnSpan = submitBtn.querySelector('span');
        const originalText = btnSpan ? btnSpan.textContent : submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        if (btnSpan) btnSpan.textContent = 'Odesílám...';

        const formData = new FormData(form);

        try {
            // HOZA.DEV:TODO — Web3Forms endpoint funguje, ale potřebuje platný access_key
            const accessKey = form.querySelector('input[name="access_key"]');
            if (accessKey && accessKey.value === 'YOUR_ACCESS_KEY') {
                // Placeholder mode — simulate submission
                console.log('Form data (placeholder mode):', Object.fromEntries(formData.entries()));
                await new Promise(resolve => setTimeout(resolve, 1200));
                showNotification('Zpráva byla odeslána! Ozveme se vám co nejdříve.', 'success');
                form.reset();
            } else {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData,
                });
                const result = await response.json();
                if (result.success) {
                    showNotification('Zpráva byla odeslána! Ozveme se vám co nejdříve.', 'success');
                    form.reset();
                } else {
                    throw new Error(result.message || 'Submission failed');
                }
            }
        } catch (error) {
            showNotification('Něco se pokazilo. Zkuste to prosím znovu.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            if (btnSpan) btnSpan.textContent = originalText;
        }
    });

    // Clear aria-invalid on input
    form.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('input', () => {
            field.removeAttribute('aria-invalid');
        });
    });
}

// Notification
function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close" aria-label="Zavřít">&times;</button>
    `;

    const bg = type === 'success'
        ? 'linear-gradient(135deg, #7B9E87, #5B8068)'
        : 'linear-gradient(135deg, #D4552A, #B84420)';

    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        padding: '18px 28px',
        background: bg,
        color: 'white',
        borderRadius: '14px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        zIndex: '9998',
        fontFamily: 'var(--font-body)',
        fontSize: '0.92rem',
        fontWeight: '500',
        animation: 'notifSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    });

    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes notifSlideIn {
                from { opacity: 0; transform: translateX(60px) scale(0.95); }
                to { opacity: 1; transform: translateX(0) scale(1); }
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.4rem;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.15s ease;
                line-height: 1;
                padding: 0 4px;
            }
            .notification-close:hover { opacity: 1; }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    notification.querySelector('.notification-close').addEventListener('click', () => {
        dismissNotification(notification);
    });

    setTimeout(() => {
        if (notification.parentNode) {
            dismissNotification(notification);
        }
    }, 5000);
}

function dismissNotification(notification) {
    notification.style.animation = 'notifSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse forwards';
    setTimeout(() => notification.remove(), 300);
}

// Cookie Consent
function initCookieConsent() {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;

    const consent = localStorage.getItem('hoza_dev_cookie_consent');
    if (consent) {
        // Already consented, apply settings
        const settings = JSON.parse(consent);
        if (settings.analytics) {
            loadAnalytics();
        }
        return;
    }

    // Show banner after a short delay
    setTimeout(() => {
        banner.classList.add('visible');
    }, 1500);

    const acceptBtn = document.getElementById('cookie-accept');
    const rejectBtn = document.getElementById('cookie-reject');
    const settingsBtn = document.getElementById('cookie-settings-btn');
    const settingsDetail = document.getElementById('cookie-settings-detail');
    const saveBtn = document.getElementById('cookie-save');
    const analyticsCheckbox = document.getElementById('cookie-analytics');

    acceptBtn.addEventListener('click', () => {
        saveConsent({ necessary: true, analytics: true });
        hideBanner();
        loadAnalytics();
    });

    rejectBtn.addEventListener('click', () => {
        saveConsent({ necessary: true, analytics: false });
        hideBanner();
    });

    settingsBtn.addEventListener('click', () => {
        settingsDetail.hidden = !settingsDetail.hidden;
    });

    saveBtn.addEventListener('click', () => {
        const analytics = analyticsCheckbox.checked;
        saveConsent({ necessary: true, analytics });
        hideBanner();
        if (analytics) loadAnalytics();
    });

    function saveConsent(settings) {
        localStorage.setItem('hoza_dev_cookie_consent', JSON.stringify(settings));
    }

    function hideBanner() {
        banner.classList.remove('visible');
        setTimeout(() => {
            banner.style.display = 'none';
        }, 400);
    }
}

function loadAnalytics() {
    // HOZA.DEV:TODO — odkomentovat po aktivaci Plausible domény
    // const script = document.createElement('script');
    // script.defer = true;
    // script.dataset.domain = 'hoza.dev';
    // script.src = 'https://plausible.io/js/script.js';
    // document.head.appendChild(script);
}

// Escape Key Handler — closes overlays
function initEscapeHandler() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close mobile menu
            const menuBtn = document.querySelector('.mobile-menu-btn');
            const navRight = document.querySelector('.nav-right');
            if (menuBtn && navRight && navRight.classList.contains('active')) {
                menuBtn.classList.remove('active');
                navRight.classList.remove('active');
                menuBtn.setAttribute('aria-expanded', 'false');
                menuBtn.setAttribute('aria-label', 'Otevřít menu');
                menuBtn.focus();
                return;
            }

            // Close cookie banner settings
            const settingsDetail = document.getElementById('cookie-settings-detail');
            if (settingsDetail && !settingsDetail.hidden) {
                settingsDetail.hidden = true;
                return;
            }

            // Close notification
            const notification = document.querySelector('.notification');
            if (notification) {
                dismissNotification(notification);
            }
        }
    });
}
