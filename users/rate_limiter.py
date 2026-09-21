"""
Login Rate Limiter — Brute-force protection using Django's cache framework.

Tracks failed login attempts per IP + username combination and blocks
further attempts after a configurable threshold (default: 5 attempts per
5 minutes).
"""

from django.core.cache import cache


# ── Configuration ─────────────────────────────────────────────────────────────

MAX_ATTEMPTS = 5          # Max failed attempts before lockout
LOCKOUT_TIMEOUT = 300     # Lockout window in seconds (5 minutes)
CACHE_PREFIX = "rl:"      # Cache key prefix for rate-limit entries


# ── Helpers ───────────────────────────────────────────────────────────────────

def get_client_ip(request):
    """
    Extract the real client IP address from the request, correctly
    handling reverse proxies (X-Forwarded-For header).
    """
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        # First IP in the chain is the real client IP
        return x_forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR", "unknown")


def _make_key(ip, username):
    """Build a cache key scoped to IP + username."""
    # Normalise username to lowercase to prevent bypass via case variation
    safe_user = (username or "anonymous").lower().replace(" ", "_")
    return f"{CACHE_PREFIX}{ip}:{safe_user}"


# ── Public API ────────────────────────────────────────────────────────────────

def check_rate_limit(ip, username, max_attempts=MAX_ATTEMPTS, timeout=LOCKOUT_TIMEOUT):
    """
    Check whether the given IP + username combination is currently rate-limited.

    Returns:
        (is_blocked: bool, remaining_seconds: int)
        - is_blocked = True  → the caller MUST reject the login attempt.
        - remaining_seconds   → approximate seconds until the lockout expires.
    """
    key = _make_key(ip, username)
    data = cache.get(key)

    if data is None:
        return False, 0

    attempts = data.get("attempts", 0)
    if attempts >= max_attempts:
        # Calculate how many seconds remain in the lockout window
        import time
        locked_at = data.get("locked_at", time.time())
        elapsed = time.time() - locked_at
        remaining = max(0, int(timeout - elapsed))
        if remaining <= 0:
            # Lockout has naturally expired — clean up
            cache.delete(key)
            return False, 0
        return True, remaining

    return False, 0


def record_failed_attempt(ip, username, max_attempts=MAX_ATTEMPTS, timeout=LOCKOUT_TIMEOUT):
    """
    Record a failed login attempt. Returns the updated attempt count.
    When the count reaches `max_attempts`, a lockout timestamp is stored.
    """
    import time

    key = _make_key(ip, username)
    data = cache.get(key) or {"attempts": 0}

    data["attempts"] = data.get("attempts", 0) + 1

    # If we just hit the threshold, record the lockout start time
    if data["attempts"] >= max_attempts and "locked_at" not in data:
        data["locked_at"] = time.time()

    cache.set(key, data, timeout)
    return data["attempts"]


def reset_rate_limit(ip, username):
    """
    Clear the failed-attempt counter on successful login so the user
    isn't penalised after a correct password entry.
    """
    key = _make_key(ip, username)
    cache.delete(key)
