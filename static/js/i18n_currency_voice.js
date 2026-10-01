/**
 * FitMaster — Internationalization, Multi-Currency, Microsoft AI Voice & Kinetic Cursor Engine
 */

(function () {
    'use strict';

    // =========================================================================
    // 1. COMPREHENSIVE MULTI-LANGUAGE (ENGLISH & HINDI) SYSTEM
    // =========================================================================
    const I18N = {
        currentLang: localStorage.getItem('fitmaster-lang') || 'en',
        _sorted: null,

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
                "Menu": "मेनू",
                "Get Started": "शुरू करें",
                "Get Started Now": "अभी शुरू करें",
                "Explore Plans": "प्लान्स देखें",
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
                "Search...": "खोजें...",
                "Back to Top": "ऊपर जाएं",
                "Back to top": "ऊपर जाएं",
                "Privacy Policy": "गोपनीयता नीति",
                "Terms of Service": "सेवा की शर्तें",
                "Cookie Settings": "कुकी सेटिंग्स",
                "All Rights Reserved.": "सर्वाधिकार सुरक्षित।",
                "All Rights Reserved": "सर्वाधिकार सुरक्षित",
                "Close": "बंद करें",
                "Select Country & Currency": "देश और मुद्रा चुनें",

                // AI Vision Coach
                "AI Coach": "एआई कोच",
                "AI Vision Coach": "एआई विज़न कोच",
                "TRY AI VISION COACH": "एआई विज़न कोच आज़माएं",
                "Launch AI Coach": "एआई कोच शुरू करें",
                "Start Camera": "कैमरा शुरू करें",
                "Stop Camera": "कैमरा बंद करें",
                "Try Demo Mode": "डेमो मोड आज़माएं",
                "Try Demo Simulation": "डेमो सिमुलेशन आज़माएं",
                "Squats": "स्क्वाट्स",
                "Bicep Curls": "बाईसेप कर्ल्स",
                "Push-Ups": "पुश-अप्स",
                "Jumping Jacks": "जंपिंग जैक्स",
                "Range of Motion (ROM)": "रेंज ऑफ मोशन (ROM)",
                "AI Voice Coach Callouts": "एआई वॉयस कोच निर्देश",
                "Kinetic Audio Rep Chimes": "काइनेटिक ऑडियो रेप बीप्स",
                "Workout Crushed!": "वर्कआउट पूरा हुआ!",

                // Scandinavian Hero on Home
                "RIGID PRECISION.": "सटीक अनुशासन।",
                "SCANDINAVIAN": "आधुनिक",
                "RECOVERY.": "रिकवरी।",
                "Industrial-grade strength architecture built with raw Swedish Eleiko steel, sensory contrast cryo-labs, and diagnostic biomechanical tracking. Calibrated for calculated, measurable human performance.": "स्वीडिश एलीको स्टील, सेंसरी क्रायो-लैब्स और बायोमैकेनिकल ट्रैकिंग के साथ निर्मित इंडस्ट्रियल-ग्रेड स्ट्रेंथ आर्किटेक्चर। मानव प्रदर्शन के उच्चतम स्तर के लिए कैलिब्रेटेड।",
                "INITIATE LAB ADMISSION": "एडमिशन शुरू करें",
                "EXAMINE DROP 04 SPECS": "प्रोग्राम विवरण देखें",
                "ACOUSTIC DAMPING": "ध्वनि नियंत्रण",
                "SUB-FLOOR SHOCK": "शॉक अब्जॉर्प्शन",
                "AIR TURNOVER": "स्वच्छ वायु",
                "42 dB ISOLATED": "42 dB आइसोलेटेड",
                "< 0.04 G-FORCE": "< 0.04 जी-फोर्स",
                "100% HEPA 14": "100% HEPA 14",
                "98.4% Documented PR Index": "98.4% प्रमाणित पीआर इंडेक्स",
                "Verified via 12-week closed barbell telemetry": "12-सप्ताह बारबेल टेलीमेट्री द्वारा सत्यापित",
                "Sub-Zero Metabolic Suites": "सब-ज़ीरो रिकवरी सुइट्स",
                "3°C cold immersion & medical InBody 770": "3°C कोल्ड इमर्शन और मेडिकल इनबॉडी 770",
                "Accredited CSCS Clinicians": "प्रमाणित विशेषज्ञ कोच",
                "Direct 1:1 kinematic velocity prescription": "सीधा 1:1 व्यक्तिगत गति मार्गदर्शन",

                // Smart BMI & Nutrition Calculator
                "🥗 Daily Health Calculator": "🥗 दैनिक स्वास्थ्य कैलकुलेटर",
                "Daily Health Calculator": "दैनिक स्वास्थ्य कैलकुलेटर",
                "Smart BMI & Nutrition Calculator": "स्मार्ट बीएमआई और पोषण कैलकुलेटर",
                "Discover your ideal daily calorie intake, healthy target weight, and tailored protein & nutrition breakdown in seconds.": "अपने आदर्श दैनिक कैलोरी सेवन, स्वस्थ लक्ष्य वजन और आवश्यक प्रोटीन की गणना सेकंडों में करें।",
                "Height (cm)": "ऊंचाई (सेमी)",
                "Weight (kg)": "वजन (किलो)",
                "Age (Years)": "उम्र (वर्ष)",
                "Age": "उम्र",
                "Gender": "लिंग",
                "Male": "पुरुष",
                "Female": "महिला",
                "Physical Activity Level": "शारीरिक गतिविधि स्तर",
                "Activity Level": "गतिविधि स्तर",
                "Sedentary (Little or no exercise)": "आलसी (कम या कोई व्यायाम नहीं)",
                "Light Exercise (1-3 days/week)": "हल्का व्यायाम (1-3 दिन/सप्ताह)",
                "Moderate (3-5 days/week)": "मध्यम व्यायाम (3-5 दिन/सप्ताह)",
                "Heavy / Athletic (6-7 days/week)": "कठिन / एथलेटिक (6-7 दिन/सप्ताह)",
                "Calculate Ideal Calories & Target": "आदर्श कैलोरी और लक्ष्य की गणना करें",
                "Calculate Now": "अभी गणना करें",
                "Your BMI Score": "आपका बीएमआई स्कोर",
                "Your BMI": "आपका बीएमआई",
                "Daily Maintenance Calories": "दैनिक मेंटेनेंस कैलोरी",
                "Daily Calories": "दैनिक कैलोरी",
                "Protein Target": "प्रोटीन लक्ष्य",
                "Carbs": "कार्ब्स",
                "Fats": "फैट्स",
                "Target Weight": "लक्ष्य वजन",
                "Underweight": "कम वजन",
                "Normal Weight": "सामान्य वजन",
                "Overweight": "अधिक वजन",
                "Obese": "मोटापा",

                // How it works / 3 Pillars
                "Discover Your Goals": "अपने लक्ष्य निर्धारित करें",
                "Tailored Workouts & Meals": "कस्टम वर्कआउट और आहार",
                "Lifelong Habits & Confidence": "स्थायी आदतें और आत्मविश्वास",
                "Tell us your targets and our AI matches your physiological baseline.": "हमें अपने लक्ष्य बताएं और हमारा AI आपकी शारीरिक क्षमता के अनुसार योजना तैयार करेगा।",
                "Dynamic kinetic training split with precise daily macronutrient targets.": "सटीक दैनिक मैक्रोन्यूट्रिएंट लक्ष्यों के साथ डायनेमिक ट्रेनिंग रूटीन।",
                "Weekly biometric tracking to ensure measurable, lasting progress.": "मापने योग्य और स्थायी प्रगति सुनिश्चित करने के लिए साप्ताहिक बायोमेट्रिक ट्रैकिंग।",

                // Popular Programs
                "Popular Training Programs": "लोकप्रिय ट्रेनिंग प्रोग्राम्स",
                "Strength Training": "स्ट्रेंथ ट्रेनिंग",
                "Cardio & HIIT": "कार्डियो और HIIT",
                "CrossFit Conditioning": "क्रॉसफ़िट कंडीशनिंग",
                "Yoga & Mobility": "योग और मोबिलिटी",
                "Explore All Programs": "सभी प्रोग्राम्स देखें",
                "View All Programs": "सभी प्रोग्राम्स देखें",
                "Why FitMaster?": "FitMaster क्यों चुनें?",
                "Next-Gen Features": "आधुनिक सुविधाएं",

                // Membership Section
                "Membership Protocols": "मेंबरशिप प्लान्स",
                "Select your tier of physiological transformation": "अपनी शारीरिक फिटनेस के लिए सर्वश्रेष्ठ प्लान चुनें",
                "⭐ Most Popular Plan": "⭐ सबसे लोकप्रिय प्लान",
                "Most Popular Plan": "सबसे लोकप्रिय प्लान",
                "Starter Protocol": "स्टार्टर प्लान",
                "Pro Athlete Protocol": "प्रो एथलीट प्लान",
                "Elite Master Protocol": "एलीट मास्टर प्लान",
                "/ 3 Months": "/ 3 माह",
                "/ 6 Months": "/ 6 माह",
                "/ 12 Months": "/ 12 माह",
                "Months": "माह",
                "3 Months Access": "3 महीने का एक्सेस",
                "6 Months Access": "6 महीने का एक्सेस",
                "12 Months VIP Access": "12 महीने का वीआईपी एक्सेस",
                "Gym & facility access": "जिम और सुविधाओं का एक्सेस",
                "Personalized Daily Workout Plans": "दैनिक व्यक्तिगत वर्कआउट प्लान",
                "Custom Nutrition & Diet Guides": "कस्टम न्यूट्रिशन और डाइट गाइड",
                "Certified Personal Trainer Assignment": "प्रमाणित पर्सनल ट्रेनर आवंटन",
                "Weekly Progress & Body Tracking": "साप्ताहिक प्रगति और बॉडी ट्रैकिंग",
                "Direct Chat with Your Coach": "अपने कोच से सीधा चैट",
                "VIP 24/7 Priority Support": "वीआईपी 24/7 प्राथमिकता सहायता",
                "Unlimited 1-on-1 Personal Training": "असीमित 1-on-1 पर्सनल ट्रेनिंग",
                "Get Starter Protocol Plan": "स्टार्टर प्लान चुनें",
                "Get Pro Athlete Protocol Plan": "प्रो एथलीट प्लान चुनें",
                "Get Elite Master Protocol Plan": "एलीट मास्टर प्लान चुनें",

                // Head Coach Message & Testimonials
                "A Message From Our Head Coach": "हमारे हेड कोच का संदेश",
                "Meet Our Elite Coaches": "हमारे शीर्ष कोच से मिलें",
                "Certified Trainers": "प्रमाणित ट्रेनर्स",

                // FAQ Section
                "Frequently Asked Questions": "अक्सर पूछे जाने वाले प्रश्न (FAQ)",
                "Is FitMaster suitable for complete beginners?": "क्या FitMaster नए शुरुआती लोगों के लिए उपयुक्त है?",
                "Yes! Every new member receives an individualized onboarding assessment. Whether you have never lifted a weight or you are training for a marathon, your plan is calibrated to your exact baseline.": "हाँ! प्रत्येक नए सदस्य का व्यक्तिगत मूल्यांकन किया जाता है। चाहे आपने पहले कभी वजन न उठाया हो, आपका प्लान आपकी क्षमता के अनुसार तैयार किया जाता है।",
                "How do the personalized meal and diet plans work?": "पर्सनलाइज्ड डाइट और मील प्लान कैसे काम करते हैं?",
                "Can I workout at home or do I need a gym membership?": "क्या मैं घर पर वर्कआउट कर सकता हूँ या जिम की आवश्यकता है?",
                "How do I get in touch with my assigned trainer?": "मैं अपने आवंटित ट्रेनर से कैसे संपर्क करूँ?",
                "Ready to Transform Your Fitness?": "क्या आप अपनी फिटनेस बदलने के लिए तैयार हैं?",
                "Join thousands of athletes achieving peak physical conditioning with FitMaster.": "FitMaster के साथ शीर्ष शारीरिक फिटनेस प्राप्त करने वाले हजारों एथलीटों से जुड़ें।",

                // AI Chatbot
                "AI Coach": "AI कोच",
                "FitMaster AI": "FitMaster AI",
                "Chat with FitMaster AI Coach": "FitMaster AI कोच से चैट करें",
                "Ask about workouts, diet, macros...": "वर्कआउट, डाइट, मैक्रोज़ के बारे में पूछें...",
                "24/7 Kinetic Coach": "24/7 पर्सनल कोच",
                "Online Coach": "ऑनलाइन कोच",
                "Clear Chat": "चैट साफ करें",
                "💪 Chest Workout": "💪 चेस्ट वर्कआउट",
                "🥗 Fat Loss Diet": "🥗 फैट लॉस डाइट",
                "⚡ Arm Growth": "⚡ आर्म्स और बाइसेप्स",
                "🌱 Veg Protein": "🌱 शाकाहारी प्रोटीन",
                "💊 Supplements": "💊 सप्लीमेंट्स",

                // Dashboards & Common Features
                "Customer Overview": "ग्राहक डैशबोर्ड",
                "Trainer Coaching Workspace": "ट्रेनर कोचिंग वर्कस्पेस",
                "Admin Control Hub": "एडमिन कंट्रोल हब",
                "My Plans": "मेरे प्लान्स",
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
                "Recent Workouts": "हाल के वर्कआउट",
                "Weekly Telemetry": "साप्ताहिक टेलीमेट्री",
                "Calories Burned": "कैलोरी बर्न",
                "Heart Rate": "हार्ट रेट",
                "Sleep Score": "नींद का स्कोर",
                "Recovery Rate": "रिकवरी दर",
                "Water Tracker": "पानी ट्रैकर",
                "Log Measurement": "माप दर्ज करें",
                "Country & Currency:": "देश और मुद्रा:"
            }
        },

        get sortedPhrases() {
            if (!this._sorted) {
                this._sorted = Object.entries(this.translations.hi)
                    .filter(([k]) => k.length > 3)
                    .sort((a, b) => b[0].length - a[0].length);
            }
            return this._sorted;
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
            
            // Update Toggle labels across navbar & dashboards
            document.querySelectorAll('#currentLangLabel, .currentLangLabel').forEach(el => {
                el.textContent = lang === 'hi' ? '🇮🇳 हिंदी' : '🇬🇧 EN';
            });

            document.querySelectorAll('[data-lang-btn]').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-lang-btn') === lang);
            });

            // Update chatbot inputs & chips
            const chatbotInput = document.getElementById('chatbot-input');
            if (chatbotInput) {
                chatbotInput.placeholder = lang === 'hi' 
                    ? "वर्कआउट, डाइट, मैक्रोज़ के बारे में पूछें..." 
                    : "Ask about workouts, diet, macros...";
            }

            // Translate or Restore DOM cleanly without destroying HTML structure
            if (lang === 'hi') {
                this.translateDOM();
            } else {
                this.restoreDOM();
            }
        },

        translateDOM() {
            const ignoreTags = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'NOSCRIPT', 'IFRAME', 'SVG']);
            
            const walk = (el) => {
                if (!el || ignoreTags.has(el.nodeName)) return;

                el.childNodes.forEach(child => {
                    if (child.nodeType === Node.TEXT_NODE) {
                        const raw = child.nodeValue;
                        const text = raw.trim();
                        if (text) {
                            if (child._origVal === undefined) {
                                child._origVal = raw;
                            }
                            
                            // Check exact match
                            if (this.translations.hi[text]) {
                                child.nodeValue = raw.replace(text, this.translations.hi[text]);
                            } else {
                                // Substring match with sorted longest phrases
                                let replaced = raw;
                                for (const [k, v] of this.sortedPhrases) {
                                    if (replaced.includes(k)) {
                                        replaced = replaced.split(k).join(v);
                                    }
                                }
                                if (replaced !== raw) {
                                    child.nodeValue = replaced;
                                }
                            }
                        }
                    } else if (child.nodeType === Node.ELEMENT_NODE) {
                        walk(child);
                    }
                });

                // Translate placeholder
                if (el.placeholder) {
                    if (el._origPlaceholder === undefined) {
                        el._origPlaceholder = el.placeholder;
                    }
                    const p = el.placeholder.trim();
                    if (this.translations.hi[p]) {
                        el.placeholder = this.translations.hi[p];
                    }
                }

                // Translate title
                if (el.title) {
                    if (el._origTitle === undefined) {
                        el._origTitle = el.title;
                    }
                    const t = el.title.trim();
                    if (this.translations.hi[t]) {
                        el.title = this.translations.hi[t];
                    }
                }
            };

            walk(document.body);
        },

        restoreDOM() {
            const ignoreTags = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'NOSCRIPT', 'IFRAME', 'SVG']);
            
            const walk = (el) => {
                if (!el || ignoreTags.has(el.nodeName)) return;

                el.childNodes.forEach(child => {
                    if (child.nodeType === Node.TEXT_NODE) {
                        if (child._origVal !== undefined) {
                            child.nodeValue = child._origVal;
                        }
                    } else if (child.nodeType === Node.ELEMENT_NODE) {
                        walk(child);
                    }
                });

                if (el.placeholder && el._origPlaceholder !== undefined) {
                    el.placeholder = el._origPlaceholder;
                }

                if (el.title && el._origTitle !== undefined) {
                    el.title = el._origTitle;
                }
            };

            walk(document.body);
        }
    };

    // =========================================================================
    // 2. MULTI-COUNTRY REGION & CURRENCY ENGINE (IN 🇮🇳 / US 🇺🇸 / UK 🇬🇧 / UAE 🇦🇪 / EU 🇪🇺 / CA 🇨🇦 / AU 🇦🇺)
    // =========================================================================
    const COUNTRIES = {
        IN: { code: 'IN', currency: 'INR', symbol: '₹', name: 'India', flag: '🇮🇳', hub: 'Mumbai / New Delhi', rate: 1, phone: '+91 (1800) 123-FITM' },
        US: { code: 'US', currency: 'USD', symbol: '$', name: 'United States', flag: '🇺🇸', hub: 'New York / Los Angeles', rate: 0.012, phone: '+1 (800) 555-FITM' },
        UK: { code: 'UK', currency: 'GBP', symbol: '£', name: 'United Kingdom', flag: '🇬🇧', hub: 'London / Manchester', rate: 0.0095, phone: '+44 (800) 999-FITM' },
        UAE: { code: 'UAE', currency: 'AED', symbol: 'AED', name: 'United Arab Emirates', flag: '🇦🇪', hub: 'Dubai / Abu Dhabi', rate: 0.044, phone: '+971 (800) 888-FITM' },
        EU: { code: 'EU', currency: 'EUR', symbol: '€', name: 'European Union', flag: '🇪🇺', hub: 'Berlin / Paris', rate: 0.011, phone: '+49 (800) 777-FITM' },
        CA: { code: 'CA', currency: 'CAD', symbol: 'C$', name: 'Canada', flag: '🇨🇦', hub: 'Toronto / Vancouver', rate: 0.016, phone: '+1 (888) 333-FITM' },
        AU: { code: 'AU', currency: 'AUD', symbol: 'A$', name: 'Australia', flag: '🇦🇺', hub: 'Sydney / Melbourne', rate: 0.018, phone: '+61 (1800) 444-FITM' }
    };

    const CURRENCY = {
        countries: COUNTRIES,
        currentCountry: localStorage.getItem('fitmaster-country') || 'IN',
        currentCurrency: localStorage.getItem('fitmaster-currency') || 'INR',

        init() {
            if (!COUNTRIES[this.currentCountry]) {
                this.currentCountry = 'IN';
                this.currentCurrency = 'INR';
            }
            this.applyCountry(this.currentCountry);
            this.initDropdown();
        },

        initDropdown() {
            // Setup click handlers for any currency toggle buttons
            document.querySelectorAll('.currency-toggle-btn, [data-currency-dropdown-toggle]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const wrap = btn.closest('.currency-dropdown-wrap') || document.querySelector('.currency-dropdown-wrap');
                    if (wrap) {
                        const menu = wrap.querySelector('.currency-dropdown-menu');
                        if (menu) {
                            const isShown = menu.classList.contains('show');
                            document.querySelectorAll('.currency-dropdown-menu.show').forEach(m => m.classList.remove('show'));
                            if (!isShown) {
                                menu.classList.add('show');
                                btn.setAttribute('aria-expanded', 'true');
                            } else {
                                btn.setAttribute('aria-expanded', 'false');
                            }
                        }
                    } else {
                        this.cycleCountry();
                    }
                });
            });

            // Setup click handlers for country options in dropdown
            document.querySelectorAll('.currency-opt').forEach(opt => {
                opt.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const code = opt.getAttribute('data-country');
                    if (code && COUNTRIES[code]) {
                        this.setCountry(code);
                    }
                    document.querySelectorAll('.currency-dropdown-menu.show').forEach(m => m.classList.remove('show'));
                    document.querySelectorAll('.currency-toggle-btn').forEach(b => b.setAttribute('aria-expanded', 'false'));
                });
            });

            // Close on click outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.currency-dropdown-wrap')) {
                    document.querySelectorAll('.currency-dropdown-menu.show').forEach(m => m.classList.remove('show'));
                    document.querySelectorAll('.currency-toggle-btn').forEach(b => b.setAttribute('aria-expanded', 'false'));
                }
            });

            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    document.querySelectorAll('.currency-dropdown-menu.show').forEach(m => m.classList.remove('show'));
                    document.querySelectorAll('.currency-toggle-btn').forEach(b => b.setAttribute('aria-expanded', 'false'));
                }
            });
        },

        setCountry(countryCode) {
            if (!COUNTRIES[countryCode]) countryCode = 'IN';
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
                this.setCountry('IN');
            }
        },

        cycleCountry() {
            const keys = Object.keys(COUNTRIES);
            let idx = keys.indexOf(this.currentCountry);
            let nextIdx = (idx + 1) % keys.length;
            this.setCountry(keys[nextIdx]);
        },

        formatPrice(amount, targetCountryCode) {
            const code = targetCountryCode || this.currentCountry;
            const config = COUNTRIES[code] || COUNTRIES.IN;
            let inrPrice = parseFloat(amount);
            if (isNaN(inrPrice)) return `${config.symbol}0`;

            if (config.code === 'US') {
                let usdVal = Math.round(inrPrice * config.rate);
                if (inrPrice === 999) usdVal = 12;
                if (inrPrice === 1999) usdVal = 24;
                if (inrPrice === 3999) usdVal = 49;
                if (usdVal < 1) usdVal = 1;
                return `$${usdVal}`;
            } else if (config.code === 'UK') {
                let gbpVal = Math.round(inrPrice * config.rate);
                if (inrPrice === 999) gbpVal = 10;
                if (inrPrice === 1999) gbpVal = 19;
                if (inrPrice === 3999) gbpVal = 39;
                if (gbpVal < 1) gbpVal = 1;
                return `£${gbpVal}`;
            } else if (config.code === 'UAE') {
                let aedVal = Math.round(inrPrice * config.rate);
                if (inrPrice === 999) aedVal = 45;
                if (inrPrice === 1999) aedVal = 89;
                if (inrPrice === 3999) aedVal = 179;
                if (aedVal < 1) aedVal = 5;
                return `${aedVal} AED`;
            } else if (config.code === 'EU') {
                let eurVal = Math.round(inrPrice * config.rate);
                if (inrPrice === 999) eurVal = 11;
                if (inrPrice === 1999) eurVal = 22;
                if (inrPrice === 3999) eurVal = 44;
                if (eurVal < 1) eurVal = 1;
                return `€${eurVal}`;
            } else if (config.code === 'CA') {
                let cadVal = Math.round(inrPrice * config.rate);
                if (inrPrice === 999) cadVal = 16;
                if (inrPrice === 1999) cadVal = 32;
                if (inrPrice === 3999) cadVal = 64;
                if (cadVal < 1) cadVal = 1;
                return `C$${cadVal}`;
            } else if (config.code === 'AU') {
                let audVal = Math.round(inrPrice * config.rate);
                if (inrPrice === 999) audVal = 18;
                if (inrPrice === 1999) audVal = 36;
                if (inrPrice === 3999) audVal = 72;
                if (audVal < 1) audVal = 1;
                return `A$${audVal}`;
            } else {
                return `₹${Math.round(inrPrice).toLocaleString('en-IN')}`;
            }
        },

        applyCountry(countryCode) {
            const config = COUNTRIES[countryCode] || COUNTRIES.IN;
            this.currentCountry = config.code;
            this.currentCurrency = config.currency;

            // Highlight active country option in dropdown and buttons
            document.querySelectorAll('[data-currency-btn], [data-country-btn]').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-currency-btn') === config.currency || btn.getAttribute('data-country-btn') === config.code);
            });

            document.querySelectorAll('.currency-opt').forEach(opt => {
                const isActive = opt.getAttribute('data-country') === config.code;
                opt.classList.toggle('active', isActive);
            });

            // Update Label in Navbar (handles both single element & multiple)
            document.querySelectorAll('#currentCurrencyLabel, .currentCurrencyLabel').forEach(el => {
                el.textContent = `${config.flag} ${config.code} (${config.symbol})`;
            });

            // Update Country Hub Labels
            document.querySelectorAll('.current-region-hub').forEach(el => {
                el.textContent = config.hub;
            });

            // Update Support Phone
            document.querySelectorAll('.current-region-phone').forEach(el => {
                el.textContent = config.phone;
            });

            // Convert all price elements on the page (including home page .pkg-price!)
            document.querySelectorAll('[data-inr-price], .price-val, .plan-price, .pkg-price, .product-price, .product-price-val, .currency-convert, .multi-currency-price').forEach(el => {
                let inrPrice = el.getAttribute('data-inr-price') || el.getAttribute('data-amount');
                if (!inrPrice) {
                    const text = el.textContent || '';
                    const match = text.match(/[\d,.]+/);
                    if (match) {
                        inrPrice = parseFloat(match[0].replace(/,/g, ''));
                        el.setAttribute('data-inr-price', inrPrice);
                    }
                }

                if (inrPrice && !isNaN(inrPrice)) {
                    const finalPriceStr = this.formatPrice(inrPrice, config.code);
                    el.textContent = finalPriceStr;
                }
            });

            // Dynamically update payment anchor links with correct converted price & currency
            document.querySelectorAll('a').forEach(a => {
                if (a.href && a.href.includes('price=')) {
                    try {
                        let url = new URL(a.href, window.location.origin);
                        let origPrice = url.searchParams.get('orig_price') || a.getAttribute('data-orig-price');
                        if (!origPrice) {
                            origPrice = url.searchParams.get('price');
                            url.searchParams.set('orig_price', origPrice);
                        }
                        let numPrice = parseFloat(origPrice);
                        if (!isNaN(numPrice)) {
                            let finalNumPrice = numPrice;
                            if (config.code === 'US') {
                                finalNumPrice = Math.round(numPrice * config.rate);
                                if (numPrice === 999) finalNumPrice = 12;
                                if (numPrice === 1999) finalNumPrice = 24;
                                if (numPrice === 3999) finalNumPrice = 49;
                                if (finalNumPrice < 1) finalNumPrice = 1;
                            } else if (config.code === 'UK') {
                                finalNumPrice = Math.round(numPrice * config.rate);
                                if (numPrice === 999) finalNumPrice = 10;
                                if (numPrice === 1999) finalNumPrice = 19;
                                if (numPrice === 3999) finalNumPrice = 39;
                                if (finalNumPrice < 1) finalNumPrice = 1;
                            } else if (config.code === 'UAE') {
                                finalNumPrice = Math.round(numPrice * config.rate);
                                if (numPrice === 999) finalNumPrice = 45;
                                if (numPrice === 1999) finalNumPrice = 89;
                                if (numPrice === 3999) finalNumPrice = 179;
                                if (finalNumPrice < 1) finalNumPrice = 5;
                            } else if (config.code === 'EU') {
                                finalNumPrice = Math.round(numPrice * config.rate);
                                if (numPrice === 999) finalNumPrice = 11;
                                if (numPrice === 1999) finalNumPrice = 22;
                                if (numPrice === 3999) finalNumPrice = 44;
                                if (finalNumPrice < 1) finalNumPrice = 1;
                            } else if (config.code === 'CA') {
                                finalNumPrice = Math.round(numPrice * config.rate);
                                if (numPrice === 999) finalNumPrice = 16;
                                if (numPrice === 1999) finalNumPrice = 32;
                                if (numPrice === 3999) finalNumPrice = 64;
                                if (finalNumPrice < 1) finalNumPrice = 1;
                            } else if (config.code === 'AU') {
                                finalNumPrice = Math.round(numPrice * config.rate);
                                if (numPrice === 999) finalNumPrice = 18;
                                if (numPrice === 1999) finalNumPrice = 36;
                                if (numPrice === 3999) finalNumPrice = 72;
                                if (finalNumPrice < 1) finalNumPrice = 1;
                            }
                            url.searchParams.set('price', finalNumPrice);
                            url.searchParams.set('currency', config.currency);
                            a.href = url.toString();
                        }
                    } catch(e) {}
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
