# AGENTS.md — FitMaster AI Repository Guide

Welcome to the **FitMaster AI** repository. This document serves as the primary technical specification, architectural blueprint, and agent operational guide for developing, maintaining, and extending the FitMaster AI fitness platform.

---

## 📌 1. Project Overview

**FitMaster AI** is a full-stack, enterprise-grade AI-powered fitness and gym management SaaS platform built with **Django** and a modern, high-contrast, dual-theme frontend (Dark & Light Mode).

### Core Features:
- **Role-Based Portals**:
  - **Customer Portal**: Personalized workout routines, meal/macro progress trackers, body composition trends, BMI calculators, and direct AI Coach assistant.
  - **Trainer Workspace**: Client roster management, customized workout/diet plan builders, progress monitoring, and scheduling calendar.
  - **Super Admin Center**: Real-time revenue & subscription analytics, user and role management, package/pricing management, supplement store inventory, and system broadcast composer.
- **AI-Powered Services**:
  - Floating Assistant Chatbot widget (`/api/chatbot/`) for instant workout suggestions, calorie estimation, and macro calculation.
  - Automated transactional and broadcast email notifications (`users.email_service`).
- **Design System & Theme Engine**:
  - 60:30:10 design rule with complete Dark Mode (Cyber Obsidian / Emerald) & Light Mode (Clean Slate / Emerald) support.
  - Instant theme switching without page reload, stored in `localStorage ('fitmaster-theme')` and synchronized across tabs.

---

## 🏗️ 2. Codebase Architecture

```
FitMaster AI/
├── FitMaster/               # Main Django Configuration
│   ├── settings.py          # Database, static files, auth, and app settings
│   ├── urls.py              # Root routing & custom error handlers (403, 404, 500)
│   ├── wsgi.py
│   └── asgi.py
│
├── users/                   # Core Business Logic Application
│   ├── models.py            # User profiles, memberships, workouts, diet, payments
│   ├── views.py             # Role-protected views, API endpoints, payment handlers
│   ├── urls.py              # Application URL patterns
│   ├── email_service.py     # Email broadcaster & welcome/payment templates
│   ├── signals.py           # Auto-profile creation on user signup
│   ├── admin.py             # Django Admin custom interfaces
│   └── tests.py             # Comprehensive test suite (All 9 tests passing)
│
├── accounts/                # User Authentication & Role Decorators
│   ├── apps.py
│   ├── models.py
│   └── views.py
│
├── templates/               # 41 Django HTML Templates
│   ├── base.html            # Public website base template
│   ├── dashboard_base.html  # Dashboard layout base (Sidebar, Topbar, Chatbot)
│   ├── home.html            # Landing page with 3D hero & feature showcase
│   ├── dashboard.html       # Customer Fitness Portal (Google Stitch UI)
│   ├── trainer_dashboard.html # Trainer workspace & client roster
│   ├── admin_dashboard.html # Super Admin Control Center & KPI analytics
│   ├── customer_plans.html  # Customer Workout & Diet plan viewer
│   ├── store.html           # Supplement e-commerce store
│   ├── membership.html      # Subscription tiers & pricing cards
│   ├── contact.html         # Contact form & location information
│   ├── login.html           # Authentication login
│   ├── signup.html          # Authentication registration
│   └── includes/            # Reusable sidebars (admin, customer, trainer)
│
├── static/
│   ├── css/                 # Vanilla CSS & Theme Engine
│   │   ├── theme_toggle.css # Complete Light/Dark mode token engine
│   │   ├── theme.css        # Global CSS variables & layout utilities
│   │   ├── dashboard_base.css # Dashboard layout & sidebar styling
│   │   ├── home.css         # Landing page hero & sections
│   │   ├── navbar.css       # Navigation header styling
│   │   ├── auth.css         # Login/Signup cards
│   │   ├── chatbot.css      # Floating AI Chatbot widget
│   │   └── programs.css     # Fitness programs catalog
│   └── js/                  # Client-side Logic
│       ├── theme_toggle.js  # Instant theme switcher with storage event sync
│       ├── chatbot.js       # Asynchronous chatbot communication
│       ├── tilt_effects.js  # 3D card tilt micro-animations
│       └── ui_interactions.js
│
├── db.sqlite3               # SQLite Database
├── manage.py                # Django CLI management utility
└── requirements.txt         # Project Python dependencies
```

---

## ⚙️ 3. Key Development & Operational Commands

### 🔹 Run Development Server
```bash
python manage.py runserver 127.0.0.1:8000
```
- Local Application URL: `http://127.0.0.1:8000/`
- Health Check: `http://127.0.0.1:8000/health/`

### 🔹 Run Automated Test Suite
```bash
python manage.py test
```

### 🔹 Apply Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 🔹 Check Project Integrity & System Checks
```bash
python manage.py check
```

---

## 🎨 4. Design Guidelines & Theme System

When developing or modifying UI elements in this repository, always adhere to the following standards:

1. **Dual Theme Strictness**:
   - Every card, text element, table, input field, and modal **MUST** look flawless in both `[data-theme="dark"]` and `[data-theme="light"]`.
   - Never use hardcoded `#fff` text or hardcoded `#000` backgrounds without considering light/dark overrides.
   - Use CSS variables (`var(--bg)`, `var(--surface)`, `var(--text)`, `var(--text-muted)`, `var(--border)`, `var(--primary)`).

2. **Color Palette Tokens**:
   - **Dark Mode**: Base `#070e17` / `#0e1511`, Surface `#161e19`, Primary Emerald `#4edea3` / `#00ff87`, Accent Cyan `#60efff`, Text `#f1f5f2`.
   - **Light Mode**: Base `#f8fafc` / `#f5fbf5`, Surface `#ffffff`, Primary Emerald `#006948` / `#00b86b`, Accent Blue `#0284c7`, Text `#171d19`.

3. **Typography**:
   - Primary Font: **Inter** / **Poppins** (`font-family: 'Inter', system-ui, sans-serif;`).
   - Line-height: `1.6` for body text, tight letter-spacing (`-0.5px`) for headings.

---

## 🛡️ 5. Security & Role Permissions

1. **Role Decorators**:
   - Customer routes: `@login_required`
   - Trainer routes: `@role_required(['trainer'])` or `@role_required(['trainer', 'admin'])`
   - Admin routes: `@role_required(['admin'])`
2. **Custom Error Pages**:
   - 403 Forbidden: `templates/403.html`
   - 404 Not Found: `templates/404.html`
   - 500 Server Error: `templates/500.html`

---

## 🤖 6. Agent Pair Programming Conventions

- **File Modifications**: Use targeted string replacements. Never blindly overwrite files without preserving business logic.
- **Django URLs**: Always use `{% url 'view_name' %}` in templates and verify against `users/urls.py`.
- **Validation**: After every major change, execute `python manage.py test` to verify that all 9 test suites pass without regression.
