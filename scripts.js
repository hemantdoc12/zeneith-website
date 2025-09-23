// XENITH EXECUTIVE SEARCH - ENHANCED WEBSITE FUNCTIONALITY
(function() {
    'use strict';

    // Feature detection and progressive enhancement
    const supportsIntersectionObserver = 'IntersectionObserver' in window;
    const supportsScrollBehavior = 'scrollBehavior' in document.documentElement.style;

    // Mobile Navigation
    function initMobileNavigation() {
        const mobileMenuButton = document.querySelector('.mobile-menu');
        const mobileNav = document.querySelector('.mobile-nav');

        if (!mobileMenuButton || !mobileNav) {
            console.warn('Mobile navigation elements not found');
            return;
        }

        mobileMenuButton.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            // Toggle navigation
            mobileNav.classList.toggle('active');

            // Update ARIA attributes
            this.setAttribute('aria-expanded', !isExpanded);

            // Update button text
            this.textContent = isExpanded ? '☰' : '✕';
        });

        // Close mobile nav when clicking links
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                mobileNav.classList.remove('active');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
                mobileMenuButton.textContent = '☰';
            });
        });

        // Close mobile nav on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
                mobileMenuButton.textContent = '☰';
                mobileMenuButton.focus();
            }
        });
    }

    // Luxury Header Scroll Effect
    function initHeaderScrollEffect() {
        const header = document.querySelector('.luxury-header');
        if (!header) {
            console.warn('Header element not found');
            return;
        }

        let ticking = false;

        function updateHeader() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // Scroll Animation Observer with fallback
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');

        if (!animatedElements.length) return;

        if (supportsIntersectionObserver) {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target); // Stop observing once animated
                    }
                });
            }, observerOptions);

            animatedElements.forEach(el => {
                observer.observe(el);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            animatedElements.forEach(el => {
                el.classList.add('animated');
            });
        }
    }

    // Enhanced smooth scrolling with fallback
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);

                if (!target) {
                    console.warn(`Target element ${targetId} not found`);
                    return;
                }

                if (supportsScrollBehavior) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                } else {
                    // Fallback smooth scroll implementation
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 80;
                    const startPosition = window.pageYOffset;
                    const distance = targetPosition - startPosition;
                    const duration = 800;
                    let start = null;

                    function animation(currentTime) {
                        if (start === null) start = currentTime;
                        const timeElapsed = currentTime - start;
                        const run = ease(timeElapsed, startPosition, distance, duration);
                        window.scrollTo(0, run);
                        if (timeElapsed < duration) requestAnimationFrame(animation);
                    }

                    function ease(t, b, c, d) {
                        t /= d / 2;
                        if (t < 1) return c / 2 * t * t + b;
                        t--;
                        return -c / 2 * (t * (t - 2) - 1) + b;
                    }

                    requestAnimationFrame(animation);
                }
            });
        });
    }

    // Animated Counters
    function initAnimatedCounters() {
        const counters = document.querySelectorAll('.hero-stats .stat-number');
        const speed = 200;

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const increment = target / speed;

            const updateCount = () => {
                const count = +counter.innerText;
                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target;
                }
            };

            // Start animation when element is visible
            if (supportsIntersectionObserver) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            updateCount();
                            observer.unobserve(entry.target);
                        }
                    });
                });

                observer.observe(counter);
            } else {
                // Fallback - start immediately
                setTimeout(updateCount, 1000);
            }
        });
    }

    // PREMIUM CONTACT FORM FUNCTIONALITY
    function initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        // Form validation
        function validateField(field) {
            const value = field.value.trim();
            const type = field.type;
            const required = field.hasAttribute('required');

            // Clear previous validation styles
            field.classList.remove('error', 'success');

            if (required && !value) {
                field.classList.add('error');
                return false;
            }

            if (value) {
                if (type === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        field.classList.add('error');
                        return false;
                    }
                }

                if (type === 'tel') {
                    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                    if (value && !phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                        field.classList.add('error');
                        return false;
                    }
                }

                field.classList.add('success');
            }

            return true;
        }

        // Real-time validation
        const formInputs = form.querySelectorAll('.form-input');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error') || input.classList.contains('success')) {
                    validateField(input);
                }
            });
        });

        // Form submission
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Validate all fields
            let isValid = true;
            formInputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            // Check privacy checkbox
            const privacyCheckbox = document.getElementById('privacy');
            if (!privacyCheckbox.checked) {
                isValid = false;
                privacyCheckbox.focus();
                showFormMessage('Please accept the privacy policy to continue.', 'error');
                return;
            }

            if (!isValid) {
                showFormMessage('Please correct the highlighted errors before submitting.', 'error');
                return;
            }

            // Show loading state
            form.classList.add('form-loading');
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Submitting...';

            try {
                // Simulate form submission (replace with actual endpoint)
                await simulateFormSubmission(new FormData(form));

                showFormMessage('Thank you for your inquiry! Our team will contact you within 24 hours.', 'success');
                form.reset();

                // Clear validation classes
                formInputs.forEach(input => {
                    input.classList.remove('error', 'success');
                });

            } catch (error) {
                console.error('Form submission error:', error);
                showFormMessage('We encountered an error submitting your form. Please try again or contact us directly.', 'error');
            } finally {
                // Remove loading state
                form.classList.remove('form-loading');
                submitButton.textContent = originalText;
            }
        });

        // Show form messages
        function showFormMessage(message, type) {
            // Remove existing messages
            const existingMessages = form.querySelectorAll('.form-success, .form-error');
            existingMessages.forEach(msg => msg.remove());

            // Create new message
            const messageEl = document.createElement('div');
            messageEl.className = `form-${type}`;
            messageEl.textContent = message;

            // Insert at top of form
            form.insertBefore(messageEl, form.firstChild);

            // Auto-remove after 10 seconds
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.remove();
                }
            }, 10000);

            // Scroll to message
            messageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Simulate form submission (replace with actual API call)
        async function simulateFormSubmission(formData) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Simulate success (replace with actual submission logic)
                    if (Math.random() > 0.1) { // 90% success rate for demo
                        resolve({ success: true });
                    } else {
                        reject(new Error('Submission failed'));
                    }
                }, 2000);
            });
        }
    }

    // Initialize all features when DOM is ready
    function init() {
        try {
            initMobileNavigation();
            initHeaderScrollEffect();
            initScrollAnimations();
            initSmoothScrolling();
            initAnimatedCounters();
            initContactForm();
        } catch (error) {
            console.error('Error initializing website features:', error);
        }
    }

    // DOM ready check
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Add screen reader only class for better accessibility
    const style = document.createElement('style');
    style.textContent = `
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
    `;
    document.head.appendChild(style);

})();