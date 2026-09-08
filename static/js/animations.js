/**
 * FITMASTER AI — Smooth Kinetic Animations & Scroll Observer
 */
(function() {
    'use strict';

    function initScrollReveals() {
        // Elements to observe for scroll animation
        const selectors = [
            '.stitch-section',
            '.calc-box-glass',
            '.timeline-row',
            '.faq-card-item',
            '.architect-card',
            '.product-store-card',
            '.stat-card',
            '.program-card',
            '.why-card',
            '.ai-box',
            '.package-card',
            '.trainer-card',
            '.goal-card',
            '.transform-card',
            '.bmi-card',
            '.hero-left',
            '.hero-right',
            '.payment-card',
            '.membership-card',
            '.store-card',
            '.feature-card',
            '.contact-form',
            '.notice-card'
        ];

        const elements = document.querySelectorAll(selectors.join(', '));
        
        if (!elements.length || !('IntersectionObserver' in window)) {
            elements.forEach(el => el.classList.add('revealed'));
            return;
        }

        elements.forEach((el, index) => {
            if (!el.classList.contains('reveal-init') && !el.classList.contains('reveal-left-init') && !el.classList.contains('reveal-right-init')) {
                el.classList.add('reveal-init');
                if (index % 2 === 1) {
                    el.classList.add('delay-1');
                }
            }
        });

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -60px 0px',
            threshold: 0.12
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Trigger number counters if present
                    const counters = entry.target.querySelectorAll('.animate-counter');
                    counters.forEach(animateCounter);
                    
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions);

        elements.forEach(el => observer.observe(el));
    }

    function animateCounter(el) {
        const target = parseFloat(el.getAttribute('data-target') || el.innerText.replace(/[^0-9.]/g, ''));
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const isDecimal = target % 1 !== 0;
        
        if (isNaN(target)) return;

        let current = 0;
        const duration = 1200;
        const startTime = performance.now();

        function updateNumber(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            current = target * easeOutQuart;

            el.innerText = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString()) + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                el.innerText = prefix + (isDecimal ? target.toFixed(1) : target.toLocaleString()) + suffix;
            }
        }

        requestAnimationFrame(updateNumber);
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollReveals);
    } else {
        initScrollReveals();
    }
})();
