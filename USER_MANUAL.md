# 🏋️ FitMaster — Complete User Manual & System Guide

**Version**: 1.0 (Production Ready)  
**PDF Document**: [FitMaster_AI_User_Manual.pdf](file:///d:/FitMaster%20AI/FitMaster_AI_User_Manual.pdf)

---

## 📌 Executive Summary

**FitMaster** is an enterprise-grade fitness management platform engineered using Django. It supports role-based workflows for **Customers**, **Trainers**, and **System Administrators**, featuring membership management, workout/diet plan creation, fitness tracking, e-commerce store, invoicing, mass broadcast messaging, and production containerization.

---

## 👥 1. Role-Based Access Control (RBAC) Matrix

| Feature / Module | Customer | Trainer | System Administrator |
| :--- | :--- | :--- | :--- |
| **Dashboard Access** | Personal Portal | Trainer Workspace | Master Admin Overview |
| **Memberships** | Browse & Purchase | View Only | Create & Manage Packages |
| **Workout & Diet Plans** | View Assigned Plans | Create & Assign Plans | Full Oversight |
| **Progress & BMI Tracking** | Log Height/Weight & Feedback | Log Progress Notes & BMI | View All Reports |
| **Session Scheduling** | View Session Dates | Schedule Client Sessions | System Oversight |
| **Store & Products** | Buy Products & Checkout | Browse Inventory | Manage Product Inventory |
| **Broadcast Notices** | Receive Email Notices | Receive Email Notices | Send Mass Announcements |

---

## 👤 2. Customer User Guide

### 2.1 Account Creation & Sign In
1. Visit **`/signup/`**: Select **Customer** role, enter Username, Email, Password, and click **Sign Up**.
2. Visit **`/login/`**: Enter your credentials to access your Customer Dashboard.

### 2.2 Customer Dashboard & Membership
- **Dashboard** (`/customer-dashboard/`): Displays your active membership package, assigned trainer details, workout/diet plans, and progress summary.
- **Buying Memberships** (`/membership/`): Choose between **3 Months**, **6 Months**, or **1 Year** packages and proceed to payment.
- **Payment & Invoices**: Pay securely using card details and download official formatted tax invoices at `/invoice/<id>/`.

### 2.3 Fitness & Body Tracking
- **My Plans & Tracking** (`/my-plans/`): Log your height (cm) and weight (kg). The system automatically calculates your **BMI**.
- **Feedback**: Submit star ratings and feedback for gym services.

### 2.4 Store & Checkout
- **Store** (`/store/`): Browse supplements and gym gear. Click **Buy Now** to checkout instantly.

---

## 🏋️ 3. Trainer User Guide

### 3.1 Account Creation & Category Selection
- Register at `/signup/` with the **Trainer** role and choose your specialization (Gym, Yoga, Pilates, Cardio).

### 3.2 Managing Clients
- **My Clients** (`/trainer/my-clients/`): View all assigned customers.
- **Add Client** (`/trainer/add-client/`): Assign unassigned customers to your roster with goals (e.g. Muscle Gain, Fat Loss).

### 3.3 Designing Workouts & Diets
- **Workout Plans** (`/trainer/workouts/`): Create custom exercise routines specifying duration (e.g. 45 min) and instructions.
- **Diet Plans** (`/trainer/diet/`): Prescribe custom daily meal plans (Breakfast, Lunch, Dinner).
- **Session Scheduling** (`/trainer/schedule/`): Book training sessions with client, date, and time.
- **Progress Log** (`/trainer/progress/`): Record client height, weight, BMI, and trainer notes.

---

## 🛡️ 4. Administrator User Guide

### 4.1 Master Dashboard (`/admin-dashboard/`)
- Monitor real-time analytics: Total Users, Total Trainers, Total Customers, Revenue ($/₹), Active Memberships, and Recent Transactions.

### 4.2 User Management (`/admin/users/`)
- View and edit all registered users. Update user roles, activate/deactivate accounts, and manually set membership start/end dates.

### 4.3 Package & Product Management
- **Packages** (`/admin/packages/`): Add, edit, or deactivate gym packages.
- **Store Inventory** (`/admin/products/`): Manage items, prices, descriptions, and photos in the store.

### 4.4 Broadcast Notices (`/admin/notices/`)
- Send broadcast emails to All Users, Customers, or Trainers simultaneously.

---

## ⚡ 5. Quick Command Reference

| Action | Command |
| :--- | :--- |
| **Activate Virtual Environment** | `.\venv\Scripts\Activate.ps1` |
| **Run Development Server** | `.\venv\Scripts\python.exe manage.py runserver` |
| **Run Windows Production Server** | `.\venv\Scripts\waitress-serve.exe --port=8000 FitMaster.wsgi:application` |
| **Run Automated Unit Tests** | `.\venv\Scripts\python.exe manage.py test` |
| **Collect Static Assets** | `.\venv\Scripts\python.exe manage.py collectstatic --noinput` |
| **Docker Compose Up** | `docker-compose up --build -d` |
