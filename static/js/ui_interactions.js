/**
 * FitMaster - Global UI Interactions & Micro-Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Animated Counter for Stats Section
    const statCards = document.querySelectorAll('.stat-card h1, .stat-widget .stat-num');
    
    if (statCards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const text = el.textContent.trim();
                    const targetNum = parseInt(text.replace(/[^0-9]/g, ''));
                    const suffix = text.replace(/[0-9]/g, '');

                    if (!isNaN(targetNum) && !el.dataset.animated) {
                        el.dataset.animated = 'true';
                        let current = 0;
                        const duration = 1800; // ms
                        const stepTime = 20;
                        const steps = duration / stepTime;
                        const increment = targetNum / steps;

                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= targetNum) {
                                el.textContent = targetNum + suffix;
                                clearInterval(timer);
                            } else {
                                el.textContent = Math.floor(current) + suffix;
                            }
                        }, stepTime);
                    }
                }
            });
        }, { threshold: 0.3 });

        statCards.forEach(card => observer.observe(card));
    }

    // 2. Custom Neon Glow Cursor Trail (Subtle)
    const cursor = document.createElement('div');
    cursor.id = 'neon-cursor-glow';
    cursor.style.cssText = `
        position: fixed;
        width: 320px;
        height: 320px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255, 85, 64, 0.12) 0%, rgba(255, 138, 122, 0.05) 40%, rgba(0,0,0,0) 70%);
        pointer-events: none;
        transform: translate(-50%, -50%);
        z-index: 9999;
        transition: transform 0.08s ease-out, opacity 0.3s ease;
        opacity: 0;
    `;
    document.body.appendChild(cursor);

    let cursorVisible = false;
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        if (!cursorVisible) {
            cursor.style.opacity = '1';
            cursorVisible = true;
        }
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorVisible = false;
    });

    // 3. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 4. Button Ripple & Micro-Interactions
    document.querySelectorAll('.btn, .btn-green, .btn-primary, .btn-outline, .buy-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.className = 'btn-ripple';
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // 5. Interactive BMI Calculator Widget
    const bmiForm = document.getElementById('bmi-calc-form');
    if (bmiForm) {
        bmiForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const height = parseFloat(document.getElementById('bmi-height').value) / 100; // in meters
            const weight = parseFloat(document.getElementById('bmi-weight').value);
            
            if (height > 0 && weight > 0) {
                const bmi = (weight / (height * height)).toFixed(1);
                const valEl = document.getElementById('bmi-val-display');
                const catEl = document.getElementById('bmi-cat-display');
                const tipEl = document.getElementById('bmi-recommendation');

                if (valEl) valEl.textContent = bmi;
                
                let category = 'Healthy Weight';
                let color = '#ff5540';
                let tip = 'Great job! Maintain your current balanced diet and exercise routine.';

                if (bmi < 18.5) {
                    category = 'Underweight';
                    color = '#60efff';
                    tip = 'Focus on hyper-caloric nutrition and strength training for muscle mass gain.';
                } else if (bmi >= 25 && bmi < 29.9) {
                    category = 'Overweight';
                    color = '#ffb703';
                    tip = 'Incorporate daily cardio sessions and moderate caloric deficit for fat loss.';
                } else if (bmi >= 30) {
                    category = 'Obese';
                    color = '#ff4d6d';
                    tip = 'Consult with a certified FitMaster trainer for a personalized low-impact program.';
                }

                if (catEl) {
                    catEl.textContent = category;
                    catEl.style.color = color;
                }
                if (tipEl) tipEl.textContent = tip;
            }
        });
    }
});
