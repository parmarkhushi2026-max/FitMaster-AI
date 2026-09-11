/**
 * FitMaster — Internationalization, Multi-Currency, Microsoft AI Voice & Kinetic Cursor Engine
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
                "Why FitMaster?": "FitMaster क्यों चुनें?",
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
    // 2. MULTI-COUNTRY REGION & CURRENCY ENGINE (US 🇺🇸 / IN 🇮🇳 / UK 🇬🇧 / UAE 🇦🇪)
    // =========================================================================
    const COUNTRIES = {
        US: { code: 'US', currency: 'USD', symbol: '$', name: 'United States', flag: '🇺🇸', hub: 'New York / Los Angeles', rate: 0.012, phone: '+1 (800) 555-FITM' },
        IN: { code: 'IN', currency: 'INR', symbol: '₹', name: 'India', flag: '🇮🇳', hub: 'Mumbai / New Delhi', rate: 1, phone: '+91 (1800) 123-FITM' },
        UK: { code: 'UK', currency: 'GBP', symbol: '£', name: 'United Kingdom', flag: '🇬🇧', hub: 'London / Manchester', rate: 0.0095, phone: '+44 (800) 999-FITM' },
        UAE: { code: 'UAE', currency: 'AED', symbol: 'AED', name: 'United Arab Emirates', flag: '🇦🇪', hub: 'Dubai / Abu Dhabi', rate: 0.044, phone: '+971 (800) 888-FITM' }
    };

    const CURRENCY = {
        countries: COUNTRIES,
        currentCountry: localStorage.getItem('fitmaster-country') || 'US',
        currentCurrency: localStorage.getItem('fitmaster-currency') || 'USD',

        init() {
            if (!COUNTRIES[this.currentCountry]) {
                this.currentCountry = 'US';
                this.currentCurrency = 'USD';
            }
            this.applyCountry(this.currentCountry);
        },

        setCountry(countryCode) {
            if (!COUNTRIES[countryCode]) countryCode = 'US';
            this.currentCountry = countryCode;
            this.currentCurrency = COUNTRIES[countryCode].currency;
            localStorage.setItem('fitmaster-country', countryCode);
            localStorage.setItem('fitmaster-currency', this.currentCurrency);
            this.applyCountry(countryCode);
            document.dispatchEvent(new CustomEvent('fitmaster:country-change', { detail: { country: countryCode, config: COUNTRIES[countryCode] } }));
        },

        setCurrency(currencyCode) {
            let matched = Object.values(COUNTRIES).find(c => c.currency === currencyCode);
            if (matched) {
                this.setCountry(matched.code);
            } else {
                this.setCountry('US');
            }
        },

        cycleCountry() {
            const keys = Object.keys(COUNTRIES);
            let idx = keys.indexOf(this.currentCountry);
            let nextIdx = (idx + 1) % keys.length;
            this.setCountry(keys[nextIdx]);
        },

        applyCountry(countryCode) {
            const config = COUNTRIES[countryCode] || COUNTRIES.US;
            this.currentCountry = config.code;
            this.currentCurrency = config.currency;

            document.querySelectorAll('[data-currency-btn], [data-country-btn]').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-currency-btn') === config.currency || btn.getAttribute('data-country-btn') === config.code);
            });

            // Update Label in Navbar
            const currDisplay = document.getElementById('currentCurrencyLabel');
            if (currDisplay) {
                currDisplay.textContent = `${config.flag} ${config.code} (${config.symbol})`;
            }

            // Update Country Hub Labels
            document.querySelectorAll('.current-region-hub').forEach(el => {
                el.textContent = config.hub;
            });

            // Update Support Phone
            document.querySelectorAll('.current-region-phone').forEach(el => {
                el.textContent = config.phone;
            });

            // Convert all price elements
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
                    let finalPriceStr = '';
                    
                    if (config.code === 'US') {
                        let usdVal = Math.round(inrPrice * config.rate);
                        if (inrPrice === 999) usdVal = 12;
                        if (inrPrice === 1999) usdVal = 24;
                        if (inrPrice === 3999) usdVal = 49;
                        if (usdVal < 1) usdVal = 1;
                        finalPriceStr = `$${usdVal}`;
                    } else if (config.code === 'UK') {
                        let gbpVal = Math.round(inrPrice * config.rate);
                        if (inrPrice === 999) gbpVal = 10;
                        if (inrPrice === 1999) gbpVal = 19;
                        if (inrPrice === 3999) gbpVal = 39;
                        if (gbpVal < 1) gbpVal = 1;
                        finalPriceStr = `£${gbpVal}`;
                    } else if (config.code === 'UAE') {
                        let aedVal = Math.round(inrPrice * config.rate);
                        if (inrPrice === 999) aedVal = 45;
                        if (inrPrice === 1999) aedVal = 89;
                        if (inrPrice === 3999) aedVal = 179;
                        if (aedVal < 1) aedVal = 5;
                        finalPriceStr = `${aedVal} AED`;
                    } else {
                        // IN
                        finalPriceStr = `₹${inrPrice.toLocaleString('en-IN')}`;
                    }

                    el.textContent = finalPriceStr;
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
    // 4. CURSOR (NATIVE BROWSER CURSOR RESTORED)
    // =========================================================================
    const CYBER_CURSOR = {
        enabled: false,
        init() {
            // Disabled to use clean native browser cursor
        },
        toggle() {}
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
