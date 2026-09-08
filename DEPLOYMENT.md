# FitMaster AI - Production Deployment Guide

This guide outlines step-by-step instructions to deploy **FitMaster AI** in a secure, scalable, enterprise production environment.

---

## 🛠️ Prerequisites

- Python 3.10+
- PostgreSQL or SQLite
- Docker & Docker Compose (optional for containerized deployment)

---

## 🌐 1. Local Production Test (using Waitress / Gunicorn)

### Steps:
1. **Prepare Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Set `DEBUG=False` and set a random secure `SECRET_KEY`.

2. **Collect Static Files**:
   ```bash
   python manage.py collectstatic --noinput
   ```

3. **Run Migrations**:
   ```bash
   python manage.py migrate
   ```

4. **Start Production Server**:
   * On **Windows**:
     ```bash
     waitress-serve --port=8000 FitMaster.wsgi:application
     ```
   * On **Linux / macOS**:
     ```bash
     gunicorn FitMaster.wsgi:application --bind 0.0.0.0:8000 --workers 3
     ```

---

## 🐳 2. Docker & Docker Compose Deployment

FitMaster AI comes pre-configured with multi-stage Docker build and Docker Compose orchestrating PostgreSQL and Django.

### Run with Docker Compose:
```bash
docker-compose up --build -d
```

### Check Logs & Status:
```bash
docker-compose logs -f web
docker-compose ps
```

---

## 🚀 3. Cloud Deployment (Render / Railway / Heroku / AWS)

### Environment Variables to set in Cloud Dashboard:
- `SECRET_KEY`: Long, random secret string.
- `DEBUG`: `False`
- `ALLOWED_HOSTS`: `yourdomain.com,your-app.onrender.com`
- `DATABASE_URL`: `postgres://user:password@hostname:5432/dbname`
- `CSRF_TRUSTED_ORIGINS`: `https://yourdomain.com`
- `SECURE_SSL_REDIRECT`: `True`

### Build Command:
```bash
pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
```

### Start Command:
```bash
gunicorn FitMaster.wsgi:application
```

---

## 🏥 Health Monitoring

FitMaster AI provides a built-in health check route for load balancers and container orchestrators:
- **Endpoint**: `GET /health/`
- **Success Response (`200 OK`)**:
  ```json
  {
    "status": "healthy",
    "service": "FitMaster AI",
    "timestamp": "2026-07-30T22:30:00+05:30",
    "database": "connected"
  }
  ```

---

## 🔒 Security Checklist

- [x] `DEBUG` is set to `False` in production.
- [x] Unique `SECRET_KEY` set via `.env`.
- [x] `WhiteNoise` configured for compressed & cached static asset delivery.
- [x] XSS, No-Sniff, and Frame-Options headers enabled.
- [x] Health check endpoint registered at `/health/`.
- [x] Custom error pages (404, 500, 403) configured.
