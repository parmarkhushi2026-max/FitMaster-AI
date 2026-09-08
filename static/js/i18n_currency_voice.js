/**
 * FitMaster AI — Internationalization, Multi-Currency, Microsoft AI Voice & Kinetic Cursor Engine
 */

(function () {
    'use strict';

    // =========================================================================
    // 1. MULTI-LANGUAGE (ENGLISH & HINDI) SYSTEM
    // =========================================================================
    const I18N = {
        currentLang: localStorage.getItem('fitmaster-lang') || 'en',
        
        translations: {
            hi: {
                // Navigation & Common
                "Home": "होम",
                "Features": "विशेषताएं",
                "Programs": "प्रोग्राम्स",
                "Trainers": "ट्रेनर्स",
                "Membership": "मेंबरशिप",
                "Store": "स्टोर",
                "Contact": "संपर्क करें",
                "Dashboard": "डैशबोर्ड",
                "Login": "लॉग इन",
                "Sign Up": "साइन अप",
                "Logout": "लॉग आउट",
                "Settings": "सेटिंग्स",
                "Get Started": "शुरू करें",
                "Explore Plans": "प्लान देखें",
                "Choose Plan": "प्लान चुनें",
                "Subscribe Now": "अभी सब्सक्राइब करें",
                "Buy Now": "अभी खरीदें",
                "Pay Now": "भुगतान करें",
                "Proceed to Payment": "पेमेंट के लिए आगे बढ़ें",
                "View All": "सभी देखें",
                "Save": "सेव करें",
                "Submit": "सबमिट करें",
                "Cancel": "रद्द करें",
                "Delete": "हटाएं",
                "Edit": "संपादित करें",
                "Active": "सक्रिय",
                "Inactive": "निष्क्रिय",
                "Search": "खोजें...",
                
                // Hero & Home
                "Kinetic AI-Driven Fitness & Athletic Performance": "काइनेटिक AI-संचालित फिटनेस और एथलेटिक प्रदर्शन",
                "Transform your physique with real-time biometric telemetry, adaptive workout splits, and elite coaching intelligence.": "रीयल-टाइम बायोमेट्रिक टेलीमेट्री, अडाप्टिव वर्कआउट स्प्लिट्स और एलिट कोचिंग इंटेलिजेंस के साथ अपने शरीर को रूपांतरित करें।",
                "Start Your Free Trial": "फ्री ट्रायल शुरू करें",
                "View Pricing": "प्राइसिंग देखें",
                "Explore Protocols": "प्रोटोकॉल देखें",
                "Why FitMaster AI?": "FitMaster AI क्यों चुनें?",
                "Smart Telemetry": "स्मार्ट टेलीमेट्री",
                "Adaptive Nutrition": "अनुकूलित पोषण",
                "Pro Coach Access": "प्रो कोच एक्सेस",
                "Real-Time Analytics": "रियल-टाइम एनालिटिक्स",
                
                // Pricing & Membership
                "Membership Protocols": "मेंबरशिप प्रोटोकॉल",
                "Select your tier of physiological transformation": "अपने शारीरिक परिवर्तन के लिए प्लान चुनें",
                "Starter Protocol": "स्टार्टर प्रोटोकॉल",
                "Pro Athlete Protocol": "प्रो एथलीट प्रोटोकॉल",
                "Elite Master Protocol": "एलीट मास्टर प्रोटोकॉल",
                "3 Months Access": "3 महीने का एक्सेस",
                "6 Months Access": "6 महीने का एक्सेस",
                "12 Months VIP Access": "12 महीने का वीआईपी एक्सेस",
                "Popular": "लोकप्रिय",
                "Most Popular": "सबसे लोकप्रिय",
                "Best Value": "सर्वश्रेष्ठ मूल्य",
                "Per Month": "प्रति माह",
                "/ Month": "/ माह",
                "/ 3 Months": "/ 3 माह",
                "/ 6 Months": "/ 6 माह",
                "/ Year": "/ वर्ष",

                // Dashboards
                "Customer Overview": "ग्राहक डैशबोर्ड",
                "Trainer Coaching Workspace": "ट्रेनर कोचिंग वर्कस्पेस",
                "Admin Control Hub": "एडमिन कंट्रोल हब",
                "Hyper-Realistic Telemetry Dashboard": "हाइपर-रियलिस्टिक टेलीमेट्री डैशबोर्ड",
                "Workout Plans": "वर्कआउट प्लान",
                "Diet Plans": "डाइट प्लान",
                "My Schedule": "मेरा शेड्यूल",
                "Progress Metrics": "प्रगति मेट्रिक्स",
                "My Clients": "मेरे क्लाइंट्स",
                "Add Client": "क्लाइंट जोड़ें",
                "Total Revenue": "कुल आय",
                "Active Members": "सक्रिय सदस्य",
                "Total Workouts": "कुल वर्कआउट्स",
                "Assigned Coach": "आवंटित कोच",
                "Message Coach": "कोच को संदेश भेजें",
                "Book Consultation": "परामर्श बुक करें",
                "Recent Workouts": "हाल के वर्कआउट",
                "Weekly Telemetry": "साप्ताहिक टेलीमेट्री",
                "Calories Burned": "कैलोरी बर्न",
                "Heart Rate": "हार्ट रेट",
                "Sleep Score": "नींद का स्कोर",
                "Recovery Rate": "रिकवरी दर",

                // Auth
                "Sign In to Your Account": "अपने खाते में साइन इन करें",
                "Create Your FitMaster Account": "अपना FitMaster खाता बनाएं",
                "Continue with Microsoft": "Microsoft के साथ आगे बढ़ें",
                "Don't have an account?": "क्या आपके पास खाता नहीं है?",
                "Already have an account?": "क्या आपके पास पहले से खाता है?",
                "Username": "यूज़रनेम",
                "Email Address": "ईमेल पता",
                "Password": "पासवर्ड",
                "Confirm Password": "पासवर्ड की पुष्टि करें",
                "Role": "भूमिका",
                "Customer (Athlete)": "ग्राहक (एथलीट)",
                "Certified Trainer": "प्रमाणित ट्रेनर",

                // Microsoft Voice
                "Listen to Plan (AI Voice)": "योजना सुनें (AI आवाज़)",
                "Playing Audio...": "ऑडियो चल रहा है...",
                "Stop Audio": "ऑडियो रोकें",
                "Voice Coach": "वॉयस कोच",
                "Microsoft AI Voice Narrator": "Microsoft AI वॉयस नैरेटर"
            }
        },

        init() {
            this.applyLanguage(this.currentLang);
        },

        setLanguage(lang) {
            this.currentLang = lang;
            localStorage.setItem('fitmaster-lang', lang);
            this.applyLanguage(lang);
            document.dispatchEvent(new CustomEvent('fitmaster:lang-change', { detail: { lang } }));
        },

        applyLanguage(lang) {
            document.documentElement.setAttribute('lang', lang === 'hi' ? 'hi' : 'en');
            
            // Update Toggle buttons
            document.querySelectorAll('[data-lang-btn]').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-lang-btn') === lang);
            });

            const langDisplay = document.getElementById('currentLangLabel');
            if (langDisplay) {
                langDisplay.textContent = lang === 'hi' ? '🇮🇳 हिंदी' : '🇬🇧 EN';
            }

            // Translate elements marked with data-i18n
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (lang === 'hi' && this.translations.hi[key]) {
                    el.textContent = this.translations.hi[key];
                } else {
                    el.textContent = key;
                }
            });

            // Automatic text replacement for common UI nodes without breaking DOM
            if (lang === 'hi') {
                this.translateDOM();
            } else {
                this.restoreDOM();
            }
        },

        translateDOM() {
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
            let node;
            while (node = walker.nextNode()) {
                const text = node.nodeValue.trim();
                if (text && this.translations.hi[text]) {
                    if (!node.parentElement.hasAttribute('data-orig-text')) {
                        node.parentElement.setAttribute('data-orig-text', text);
                    }
                    node.nodeValue = node.nodeValue.replace(text, this.translations.hi[text]);
                }
            }
        },

        restoreDOM() {
            document.querySelectorAll('[data-orig-text]').forEach(el => {
                const orig = el.getAttribute('data-orig-text');
                el.textContent = orig;
                el.removeAttribute('data-orig-text');
            });
        }
    };

    // =========================================================================
    // 2. MULTI-CURRENCY & REGION (INDIA ₹ / US $) ENGINE
    // =========================================================================
    const CURRENCY = {
        currentCurrency: localStorage.getItem('fitmaster-currency') || 'INR',
        rateUSD: 0.012, // 1 INR ~ 0.012 USD (~$12 for ₹999, ~$24 for ₹1999, ~$49 for ₹3999)
        rateINR: 83.33,

        init() {
            this.applyCurrency(this.currentCurrency);
        },

        setCurrency(currency) {
            this.currentCurrency = currency;
            localStorage.setItem('fitmaster-currency', currency);
            this.applyCurrency(currency);
            document.dispatchEvent(new CustomEvent('fitmaster:currency-change', { detail: { currency } }));
        },

        applyCurrency(currency) {
            document.querySelectorAll('[data-currency-btn]').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-currency-btn') === currency);
            });

            const currDisplay = document.getElementById('currentCurrencyLabel');
            if (currDisplay) {
                currDisplay.textContent = currency === 'USD' ? '🇺🇸 USD ($)' : '🇮🇳 INR (₹)';
            }

            // Convert all price elements with data-inr-price or formatted with ₹
            document.querySelectorAll('[data-inr-price], .price-val, .plan-price, .product-price, .currency-convert').forEach(el => {
                let inrPrice = el.getAttribute('data-inr-price');
                if (!inrPrice) {
                    const text = el.textContent || '';
                    const match = text.match(/[\d,.]+/);
                    if (match) {
                        inrPrice = parseFloat(match[0].replace(/,/g, ''));
                        el.setAttribute('data-inr-price', inrPrice);
                    }
                }

                if (inrPrice && !isNaN(inrPrice)) {
                    inrPrice = parseFloat(inrPrice);
                    if (currency === 'USD') {
                        let usdVal = Math.round(inrPrice * this.rateUSD);
                        if (inrPrice === 999) usdVal = 12;
                        if (inrPrice === 1999) usdVal = 24;
                        if (inrPrice === 3999) usdVal = 49;
                        if (usdVal < 1) usdVal = 1;
                        el.textContent = `$${usdVal}`;
                    } else {
                        el.textContent = `₹${inrPrice.toLocaleString('en-IN')}`;
                    }
                }
            });
        }
    };

    // =========================================================================
    // 3. MICROSOFT COGNITIVE AI VOICE COACH (ENGLISH & HINDI)
    // =========================================================================
    const MS_VOICE = {
        synth: window.speechSynthesis || null,
        speaking: false,
        voices: [],

        init() {
            if (!this.synth) return;
            try {
                this.synth.cancel();
            } catch (e) {}
        },

        loadVoices() {},

        speak(text, lang = null) {
            // Voice disabled
            this.stop();
        },

        stop() {
            if (this.synth) {
                try {
                    this.synth.cancel();
                } catch (e) {}
            }
            this.speaking = false;
            this.updateUIState(false);
        },

        toggle(text) {
            this.stop();
        },

        updateUIState(isPlaying) {
            document.querySelectorAll('.ms-voice-btn').forEach(btn => {
                btn.classList.toggle('is-playing', isPlaying);
                const label = btn.querySelector('.voice-btn-label');
                if (label) {
                    label.textContent = isPlaying ? (I18N.currentLang === 'hi' ? 'रोकें' : 'Stop Audio') : (I18N.currentLang === 'hi' ? 'सुनें' : 'Listen Voice');
                }
                const icon = btn.querySelector('i, .material-symbols-outlined');
                if (icon) {
                    if (icon.tagName === 'I') {
                        icon.className = isPlaying ? 'fa-solid fa-stop text-red-500' : 'fa-solid fa-volume-high';
                    } else {
                        icon.textContent = isPlaying ? 'stop_circle' : 'volume_up';
                    }
                }
            });
        }
    };

    // =========================================================================
    // 4. KINETIC CYBER CURSOR (CUSTOM ACCELERATED GLOW CURSOR)
    // =========================================================================
    const CYBER_CURSOR = {
        dot: null,
        ring: null,
        enabled: localStorage.getItem('fitmaster-cursor') !== 'false',
        mouseX: window.innerWidth / 2,
        mouseY: window.innerHeight / 2,
        ringX: window.innerWidth / 2,
        ringY: window.innerHeight / 2,

        init() {
            if (window.matchMedia('(pointer: coarse)').matches) {
                return; // Disable on touch screens
            }

            this.createElements();
            this.bindEvents();
            this.renderLoop();
        },

        createElements() {
            this.dot = document.createElement('div');
            this.dot.className = 'cyber-cursor-dot';
            this.dot.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 8px;
                height: 8px;
                background: #ff5540;
                border-radius: 50%;
                pointer-events: none;
                z-index: 999999;
                transform: translate(-50%, -50%);
                transition: opacity 0.2s, transform 0.1s;
                box-shadow: 0 0 12px #ff5540, 0 0 24px rgba(255, 85, 64, 0.6);
            `;

            this.ring = document.createElement('div');
            this.ring.className = 'cyber-cursor-ring';
            this.ring.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 34px;
                height: 34px;
                border: 1.5px solid rgba(255, 85, 64, 0.65);
                border-radius: 50%;
                pointer-events: none;
                z-index: 999998;
                transform: translate(-50%, -50%);
                transition: width 0.2s, height 0.2s, border-color 0.2s, background-color 0.2s;
                backdrop-filter: blur(1px);
            `;

            document.body.appendChild(this.dot);
            document.body.appendChild(this.ring);

            if (!this.enabled) {
                this.dot.style.display = 'none';
                this.ring.style.display = 'none';
            }
        },

        bindEvents() {
            window.addEventListener('mousemove', e => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
                if (this.dot) {
                    this.dot.style.left = `${this.mouseX}px`;
                    this.dot.style.top = `${this.mouseY}px`;
                }
            }, { passive: true });

            document.addEventListener('mouseover', e => {
                const target = e.target.closest('a, button, input, select, textarea, .clickable, .card, [role="button"]');
                if (target && this.ring) {
                    this.ring.style.width = '50px';
                    this.ring.style.height = '50px';
                    this.ring.style.borderColor = '#ff8a7a';
                    this.ring.style.backgroundColor = 'rgba(255, 85, 64, 0.08)';
                    if (this.dot) this.dot.style.transform = 'translate(-50%, -50%) scale(1.4)';
                }
            });

            document.addEventListener('mouseout', e => {
                const target = e.target.closest('a, button, input, select, textarea, .clickable, .card, [role="button"]');
                if (target && this.ring) {
                    this.ring.style.width = '34px';
                    this.ring.style.height = '34px';
                    this.ring.style.borderColor = 'rgba(255, 85, 64, 0.65)';
                    this.ring.style.backgroundColor = 'transparent';
                    if (this.dot) this.dot.style.transform = 'translate(-50%, -50%) scale(1)';
                }
            });

            document.addEventListener('mousedown', () => {
                if (this.ring) {
                    this.ring.style.transform = 'translate(-50%, -50%) scale(0.8)';
                }
            });

            document.addEventListener('mouseup', () => {
                if (this.ring) {
                    this.ring.style.transform = 'translate(-50%, -50%) scale(1)';
                }
            });
        },

        renderLoop() {
            const lerp = (start, end, factor) => start + (end - start) * factor;
            
            const animate = () => {
                this.ringX = lerp(this.ringX, this.mouseX, 0.18);
                this.ringY = lerp(this.ringY, this.mouseY, 0.18);

                if (this.ring) {
                    this.ring.style.left = `${this.ringX}px`;
                    this.ring.style.top = `${this.ringY}px`;
                }

                requestAnimationFrame(animate);
            };

            requestAnimationFrame(animate);
        },

        toggle() {
            this.enabled = !this.enabled;
            localStorage.setItem('fitmaster-cursor', this.enabled);
            if (this.dot && this.ring) {
                this.dot.style.display = this.enabled ? 'block' : 'none';
                this.ring.style.display = this.enabled ? 'block' : 'none';
            }
        }
    };

    // =========================================================================
    // EXPOSE TO WINDOW & INITIALIZE
    // =========================================================================
    window.FitMasterI18n = I18N;
    window.FitMasterCurrency = CURRENCY;
    window.FitMasterVoice = MS_VOICE;
    window.FitMasterCursor = CYBER_CURSOR;

    document.addEventListener('DOMContentLoaded', () => {
        I18N.init();
        CURRENCY.init();
        MS_VOICE.init();
        CYBER_CURSOR.init();
    });

})();
