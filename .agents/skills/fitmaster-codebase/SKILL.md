---
name: fitmaster-codebase
description: >
  Complete architectural reference for the FitMaster AI Django project.
  Read this FIRST before touching any file — it maps every model, view,
  service, template, URL, and design convention so you never need to
  re-scan the entire codebase.
---

# FitMaster AI — Complete Codebase Reference Skill

> **Purpose**: This skill gives you instant, full context of the FitMaster AI
> project so you can start coding immediately without reading every file.
> Always read this skill at the start of any new conversation involving
> FitMaster AI.

---

## 1. Project Identity

| Key | Value |
|---|---|
| **Framework** | Django 5.x (Python) |
| **Database** | SQLite (`db.sqlite3`), switchable via `DATABASE_URL` env var |
| **Frontend** | Django templates + Vanilla CSS + Vanilla JS (NO React/Vue/Tailwind) |
| **Theme** | Dual Dark/Light mode via CSS variables & `localStorage('fitmaster-theme')` |
| **Static Serving** | WhiteNoise |
| **Dev Server** | `venv\Scripts\python manage.py runserver` (Windows) |
| **Python venv** | `venv\` in project root |
| **Workspace Root** | `c:\Users\KHUSHI\Downloads\FitMaster AI (1)\FitMaster AI\` |

---

## 2. Directory Structure

```
FitMaster AI/
├── FitMaster/                    # Django project config
│   ├── settings.py               # All config: DB, email, Razorpay, Twilio, Gupshup, CSP, logging
│   ├── urls.py                   # Root URL conf (includes users.urls + custom error handlers)
│   ├── wsgi.py / asgi.py
│
├── users/                        # CORE app — ALL business logic lives here
│   ├── models.py                 # 15 models (see §3)
│   ├── views.py                  # ~2240 lines, 55+ view functions (see §4)
│   ├── urls.py                   # 77 URL patterns (see §5)
│   ├── admin.py                  # Django admin registration for all models
│   ├── signals.py                # Auto-creates Profile on User creation
│   ├── email_service.py          # EmailService class — send + log emails
│   ├── notification_service.py   # create_notification, broadcast, notify_* helpers
│   ├── sms_whatsapp_service.py   # AlertService class — Twilio/Gupshup SMS & WhatsApp
│   ├── validators.py             # sanitize_text, validate_username/email/phone/password/number/date/time
│   ├── rate_limiter.py           # get_client_ip, check_rate_limit, record_failed_attempt, reset_rate_limit
│   ├── tests.py                  # Comprehensive test suite
│   ├── templatetags/
│   │   └── notification_tags.py  # Template tag for notification bell
│   └── migrations/               # 15 migration files
│
├── templates/                    # 42 HTML templates + includes/
│   ├── base.html                 # Public pages base (navbar, footer)
│   ├── dashboard_base.html       # Dashboard base (sidebar, topbar, chatbot)
│   ├── home.html                 # Landing page (3D hero, features)
│   ├── login.html / signup.html  # Auth pages
│   ├── dashboard.html            # Customer dashboard (huge, ~105KB)
│   ├── trainer_dashboard.html    # Trainer workspace
│   ├── admin_dashboard.html      # Admin control center
│   ├── payment.html              # Payment page (Razorpay integration)
│   ├── notifications.html        # Notification center page
│   ├── includes/
│   │   ├── notification_bell.html  # AJAX notification dropdown (used in dashboard_base)
│   │   ├── admin_sidebar.html
│   │   ├── customer_sidebar.html
│   │   └── trainer_sidebar.html
│   └── ... (membership, store, contact, programs, trainers, etc.)
│
├── static/
│   ├── css/                      # 31 CSS files
│   │   ├── theme.css             # Global CSS variables & layout utilities
│   │   ├── theme_toggle.css      # Complete dark/light token engine (~34KB)
│   │   ├── dashboard_base.css    # Dashboard layout & sidebar
│   │   ├── navbar.css            # Navigation header
│   │   ├── home.css              # Landing page styles
│   │   └── auth.css              # Login/Signup card styles
│   ├── js/                       # 10 JS files
│   │   ├── theme_toggle.js       # Theme switcher with storage sync
│   │   ├── chatbot.js            # AI chatbot communication
│   │   ├── i18n_currency_voice.js # Internationalization & currency
│   │   └── ui_interactions.js    # General UI interactions
│   └── images/
│
├── db.sqlite3                    # SQLite database
├── manage.py                     # Django management utility
├── requirements.txt              # Python dependencies
├── .env                          # Environment variables (secrets)
└── AGENTS.md                     # Existing agent guide (less detailed)
```

---

## 3. Models (`users/models.py` — 15 models)

| Model | Key Fields | Purpose |
|---|---|---|
| `Package` | name, duration_months, price, description, is_active | Subscription tiers |
| `Payment` | user(FK), name, plan, amount, card, transaction_type, currency, created_at | Payment records |
| `Product` | name, price, image, description | Store products |
| `Profile` | user(O2O), role(admin/customer/trainer), phone_number, sms_alerts_enabled, whatsapp_alerts_enabled | User profile & settings |
| `TrainerDetail` | user(O2O), category(gym/yoga/zumba) | Trainer specialization |
| `Membership` | user(FK), package(FK), start_date, end_date, is_active | Active subscriptions |
| `Client` | trainer(FK), client(FK), goal, joined_on, status | Trainer↔Client mapping |
| `WorkoutPlan` | trainer(FK), client(FK), title, description, duration | Workout plans |
| `DietPlan` | trainer(FK), client(FK), breakfast, lunch, dinner | Diet plans |
| `Schedule` | trainer(FK), client(FK), session_date, session_time | Training sessions |
| `Progress` | trainer(FK), client(FK), weight, height, bmi, notes | Client progress records |
| `Measurement` | customer(FK), weight, height, bmi, month | Self-logged body measurements |
| `Feedback` | customer(FK), rating, message | Customer feedback |
| `Notice` | subject, message, recipient_role(all/customer/trainer), email_sent | Admin broadcast notices |
| `EmailNotification` | recipient(FK), recipient_email, subject, message, notification_type, sent_status, error_log | Email log |
| `Notification` | user(FK), title, message, notification_type, link, is_read | In-app notifications |
| `AlertLog` | user(FK), channel(sms/whatsapp), recipient_phone, message, status, provider, response_payload | SMS/WhatsApp log |

### Important Relationships
- `User` ← O2O → `Profile` (auto-created via signal)
- `User` ← O2O → `TrainerDetail` (created on trainer signup)
- `Profile.role` determines dashboard routing: admin → admin_dashboard, trainer → trainer_dashboard, customer → customer_dashboard

---

## 4. Views (`users/views.py` — ~2240 lines, 55+ functions)

### Helper Functions (top of file)
| Function | Line | Purpose |
|---|---|---|
| `ensure_default_packages()` | ~85 | Creates 3 default packages if none exist |
| `get_profile(user)` | ~96 | Gets or creates Profile for a user |
| `require_role(request, *roles)` | ~104 | Checks user role, returns 403 if unauthorized |
| `get_trainer_client_or_none(request)` | ~114 | Gets trainer's Client queryset |

### Public Views
| View | URL | Method | Purpose |
|---|---|---|---|
| `home` | `/` | GET | Landing page |
| `signup` | `/signup/` | GET/POST | User registration (customer/trainer) |
| `user_login` | `/login/` | GET/POST | Login with rate limiting |
| `forgot_password` | `/forgot-password/` | GET/POST | Password reset |
| `microsoft_login` | `/auth/microsoft/` | GET | Microsoft OAuth flow |
| `logout_view` | `/logout/` | GET | Logout |
| `membership` | `/membership/` | GET | Membership tiers |
| `features` | `/features/` | GET | Features page |
| `programs` | `/programs/` | GET | Programs catalog |
| `trainers` | `/trainers/` | GET | Trainers showcase |
| `contact` | `/contact/` | GET/POST | Contact form |

### Dashboard Views (login required)
| View | URL | Role | Purpose |
|---|---|---|---|
| `dashboard` | `/dashboard/` | Any | Routes to role-specific dashboard |
| `admin_dashboard` | `/admin-dashboard/` | admin | Admin KPIs, charts, user management |
| `customer_dashboard` | `/customer-dashboard/` | customer | Fitness portal, workout tracker |
| `trainer_dashboard` | `/trainer-dashboard/` | trainer | Client roster, plans |
| `metrics_dashboard` | `/metrics/` | customer | Body metrics & progress charts |

### Customer Views
| View | URL | Purpose |
|---|---|---|
| `log_measurement` | `/log-measurement/` | Log weight/height/BMI |
| `update_water` | `/update-water/` | AJAX water intake update |
| `update_set_status` | `/update-set-status/` | AJAX workout set completion |
| `add_workout_exercise` | `/add-workout-exercise/` | AJAX add exercise |
| `customer_plans` | `/my-plans/` | View assigned workout/diet plans |
| `settings` | `/settings/` | Profile settings |

### Trainer Views
| View | URL | Purpose |
|---|---|---|
| `workout_plans` | `/trainer/workouts/` | Create/manage workout plans |
| `diet_plans` | `/trainer/diet/` | Create/manage diet plans |
| `schedule` | `/trainer/schedule/` | Create training sessions |
| `progress` | `/trainer/progress/` | Log client progress |
| `my_clients` | `/trainer/my-clients/` | View client roster |
| `add_client` | `/trainer/add-client/` | Add new client |

### Admin Views
| View | URL | Purpose |
|---|---|---|
| `users_list` | `/admin/users/` | All users table |
| `edit_user` | `/admin/users/<id>/edit/` | Edit user profile/role |
| `delete_user` | `/admin/users/<id>/delete/` | Delete user |
| `admin_packages` | `/admin/packages/` | Manage subscription packages |
| `admin_products` | `/admin/products/` | Manage store products |
| `notices` | `/admin/notices/` | Create/broadcast notices |
| `assign_trainer` | `/admin/assign-trainer/` | Assign trainer to customer |
| `trainers_list` | `/admin/trainers/` | Trainers table |
| `customers_list` | `/admin/customers/` | Customers table |

### Payment Views
| View | URL | Purpose |
|---|---|---|
| `payment` | `/payment/` | Payment page (Razorpay) |
| `checkout` | `/checkout/` | Process checkout |
| `payment_success` | `/payment-success/` | Success page |
| `store` | `/store/` | Product store |
| `transaction_history` | `/transactions/` | Payment history |
| `invoice` | `/invoice/<id>/` | Invoice view |

### API Endpoints
| View | URL | Purpose |
|---|---|---|
| `chatbot_api` | `/api/chatbot/` | AI chatbot (Google Gemini) |
| `platform_sync_api` | `/api/platform-sync/` | External platform sync |
| `api_notifications` | `/api/notifications/` | Fetch notifications (JSON) |
| `api_mark_notification_read` | `/api/notifications/<id>/read/` | Mark single as read |
| `api_mark_all_read` | `/api/notifications/mark-all-read/` | Mark all read |
| `api_clear_notifications` | `/api/notifications/clear/` | Delete all |

---

## 5. Service Modules

### `notification_service.py` — In-App Notifications
```python
create_notification(user, title, message, notification_type="system", link="")
broadcast_role_notification(role, title, message, notification_type="notice", link="")
notify_welcome(user)
notify_payment_success(user, plan, amount, currency="INR")
notify_workout_assigned(client_user, trainer_user, title)
notify_diet_assigned(client_user, trainer_user)
notify_schedule_created(client_user, trainer_user, session_date, session_time)
notify_trainer_assignment(client_user, trainer_user)
```

### `sms_whatsapp_service.py` — SMS & WhatsApp
```python
class AlertService:
    format_phone(phone_str) → str           # Cleans to E.164
    send_sms(phone, message, user=None) → bool   # Twilio REST API
    send_whatsapp(phone, message, user=None) → bool  # Twilio or Gupshup
    whatsapp_direct_url(phone, message) → str  # 1-click wa.me URL

# Convenience helpers:
alert_signup_welcome(user)
alert_payment_success(user, plan, amount, currency="INR")
alert_workout_assigned(client_user, trainer_user, title)
alert_diet_assigned(client_user, trainer_user)
alert_schedule_session(client_user, trainer_user, date, time)
```

### `email_service.py` — Email
```python
class EmailService:
    send_notification(subject, message, recipient_email, recipient_user=None, notification_type="General")
    send_welcome(user)
    send_payment_confirmation(user, plan, amount)
    send_notice(notice)  # Broadcasts to all matching users
```

### `validators.py` — Server-Side Validation
```python
sanitize_text(text, max_len=None) → str
validate_username(username) → (bool, error_msg)
validate_email_format(email) → (bool, error_msg)
validate_phone_format(phone) → (bool, error_msg)
validate_password_strength(password) → (bool, error_msg)
validate_positive_number(val, name, min_val=None, max_val=None) → (bool, error_msg)
validate_date_string(date_str) → (date_obj | None, error_msg)
validate_time_string(time_str) → (time_obj | None, error_msg)
```

### `rate_limiter.py` — Brute-Force Protection
```python
get_client_ip(request) → str              # Handles X-Forwarded-For
check_rate_limit(ip, username) → (bool, int)  # (is_blocked, remaining_secs)
record_failed_attempt(ip, username) → int   # Returns attempt count
reset_rate_limit(ip, username)             # Clears on success
# Config: MAX_ATTEMPTS=5, LOCKOUT_TIMEOUT=300s, uses Django cache
```

---

## 6. Signals (`users/signals.py`)

- `post_save` on `User` → auto-creates `Profile` via `get_or_create`

---

## 7. Settings Highlights (`FitMaster/settings.py`)

| Setting | Value/Note |
|---|---|
| Database | SQLite default, `DATABASE_URL` for production |
| Email | Gmail SMTP or console backend (auto-detected) |
| Razorpay | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` from `.env` |
| Twilio SMS | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` |
| Twilio WhatsApp | `TWILIO_WHATSAPP_NUMBER` (default sandbox: +14155238886) |
| Gupshup | `GUPSHUP_API_KEY`, `GUPSHUP_APP_NAME` |
| CSP | Strict Content-Security-Policy via `django-csp` middleware |
| HSTS/SSL | Configurable via env vars, disabled in DEBUG |
| Logging | File + Console, logs in `logs/` dir |
| Static | WhiteNoise with CompressedManifestStaticFilesStorage |
| Timezone | `Asia/Kolkata` |
| Auth URLs | LOGIN_URL=`login`, LOGIN_REDIRECT_URL=`dashboard` |

---

## 8. Design System & Theme Conventions

### CSS Variables (always use these, NEVER hardcode colors)
```css
var(--bg)         /* Page background */
var(--surface)    /* Card/panel background */
var(--text)       /* Primary text */
var(--text-muted) /* Secondary text */
var(--border)     /* Borders */
var(--primary)    /* Primary accent (emerald) */
```

### Color Palettes
- **Dark Mode**: Base `#070e17`, Surface `#161e19`, Primary `#4edea3`/`#00ff87`, Text `#f1f5f2`
- **Light Mode**: Base `#f8fafc`, Surface `#ffffff`, Primary `#006948`/`#00b86b`, Text `#171d19`

### Typography
- Font: **Inter** / **Poppins** (`font-family: 'Inter', system-ui, sans-serif`)
- Body line-height: `1.6`, Heading letter-spacing: `-0.5px`

### Rules
1. Every UI element MUST work in both `[data-theme="dark"]` and `[data-theme="light"]`
2. Theme toggle stored in `localStorage('fitmaster-theme')`, synced across tabs
3. Follow 60:30:10 color rule

---

## 9. Template Conventions

- **Django tags**: Always use `{% url 'view_name' %}` for links
- **Base templates**: Public pages extend `base.html`, dashboards extend `dashboard_base.html`
- **Sidebar includes**: `includes/admin_sidebar.html`, `includes/customer_sidebar.html`, `includes/trainer_sidebar.html`
- **Notification bell**: Included via `{% load notification_tags %}` → `{% notification_bell %}` in `dashboard_base.html`
- **Messages**: Use Django messages framework, displayed via `{% if messages %}` block in base templates

---

## 10. Testing & Verification Commands

```bash
# System check
venv\Scripts\python manage.py check

# Run all tests
venv\Scripts\python manage.py test

# Run specific test file
venv\Scripts\python manage.py test test_rate_limiter --verbosity=2

# Make and apply migrations
venv\Scripts\python manage.py makemigrations
venv\Scripts\python manage.py migrate

# Start dev server
venv\Scripts\python manage.py runserver
```

---

## 11. Common Patterns & Conventions

### Role Checking Pattern (in views)
```python
profile = get_profile(request.user)
if profile.role != "admin":
    return require_role(request, "admin")  # Returns 403
```

### Notification Trigger Pattern (after an action)
```python
from .notification_service import notify_payment_success
from .sms_whatsapp_service import alert_payment_success

# After successful payment:
notify_payment_success(user, plan_name, amount, currency)
alert_payment_success(user, plan_name, amount, currency)
```

### Validation Pattern (in POST handlers)
```python
from .validators import sanitize_text, validate_email_format

name = sanitize_text(request.POST.get("name", ""))
email_valid, email_err = validate_email_format(email)
if not email_valid:
    messages.error(request, email_err)
    return render(request, "template.html")
```

### Rate Limit Pattern (in login)
```python
from .rate_limiter import get_client_ip, check_rate_limit, record_failed_attempt, reset_rate_limit

ip = get_client_ip(request)
blocked, remaining = check_rate_limit(ip, username)
if blocked:
    messages.error(request, f"Wait {remaining} seconds")
    return render(...)

# On failure:
record_failed_attempt(ip, username)
# On success:
reset_rate_limit(ip, username)
```

---

## 12. Important Notes for Agents

1. **views.py is ~2240 lines** — use `grep_search` or line ranges, don't read the whole file.
2. **All imports** are at lines 1–63 of views.py — check here before adding new imports.
3. **Profile auto-creation** via signal — never manually create Profile, just create User.
4. **Currency** is dynamic per country — `payment.html` has JS for country-based currency detection.
5. **Chatbot** uses Google Gemini API (`generativelanguage.googleapis.com`).
6. **No REST framework** — all APIs are plain Django `JsonResponse`.
7. **No frontend framework** — all JS is vanilla, no npm/webpack.
8. **Windows paths** — always use `venv\Scripts\python` not `python` directly.
