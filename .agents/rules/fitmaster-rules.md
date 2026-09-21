# FitMaster AI — Agent Rules

## Mandatory First Step
Before writing any code or making any changes in this repository, **always read the `fitmaster-codebase` skill first**. This skill contains the complete architectural reference — all models, views, services, URLs, design conventions, and coding patterns.

## Code Conventions
1. **Use service modules** — Don't write notification/email/SMS logic inline in views. Use `notification_service.py`, `sms_whatsapp_service.py`, `email_service.py`.
2. **Use validators** — All user input must go through `validators.py` functions before processing.
3. **Use rate_limiter** — Login views must use `rate_limiter.py` for brute-force protection.
4. **Use CSS variables** — Never hardcode colors. Always use `var(--bg)`, `var(--surface)`, `var(--primary)`, etc.
5. **Both themes** — Every UI change must look correct in both dark and light mode.
6. **Django URL tags** — Always use `{% url 'name' %}` in templates, never hardcode URLs.

## Testing
- Run `venv\Scripts\python manage.py check` after any model/view change.
- Run `venv\Scripts\python manage.py test` after any logic change.
- Run migrations after any model change: `makemigrations` → `migrate`.

## File Navigation Tips
- `views.py` is ~2240 lines — use `grep_search` to find specific views, don't read the whole file.
- All imports are at lines 1–63 of `views.py`.
- Windows paths — use `venv\Scripts\python`, not `python`.
