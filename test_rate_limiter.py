"""
Automated tests for Login Rate Limiting & Brute-Force Protection.
Verifies:
  1. Normal login is NOT blocked.
  2. After 5 failed attempts, the 6th is blocked with a rate-limit message.
  3. Successful login resets the counter.
  4. IP extraction handles X-Forwarded-For correctly.
"""

import os, sys, django

# ── Bootstrap Django ──────────────────────────────────────────────────────────
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "FitMaster.settings")
django.setup()

from django.test import TestCase, RequestFactory, override_settings
from django.contrib.auth.models import User
from django.core.cache import cache
from users.rate_limiter import (
    get_client_ip,
    check_rate_limit,
    record_failed_attempt,
    reset_rate_limit,
)


class RateLimiterUnitTests(TestCase):
    """Unit tests for the rate_limiter module functions."""

    def setUp(self):
        cache.clear()
        self.factory = RequestFactory()

    def tearDown(self):
        cache.clear()

    # ── get_client_ip ─────────────────────────────────────────────────
    def test_ip_from_remote_addr(self):
        request = self.factory.get("/")
        request.META["REMOTE_ADDR"] = "192.168.1.10"
        self.assertEqual(get_client_ip(request), "192.168.1.10")

    def test_ip_from_x_forwarded_for(self):
        request = self.factory.get("/")
        request.META["HTTP_X_FORWARDED_FOR"] = "10.0.0.5, 192.168.1.1"
        self.assertEqual(get_client_ip(request), "10.0.0.5")

    # ── check / record cycle ─────────────────────────────────────────
    def test_no_block_before_threshold(self):
        ip, user = "1.2.3.4", "testuser"
        for i in range(4):
            record_failed_attempt(ip, user)
            blocked, _ = check_rate_limit(ip, user)
            self.assertFalse(blocked, f"Should NOT be blocked after {i+1} attempts")

    def test_blocked_at_threshold(self):
        ip, user = "1.2.3.4", "testuser"
        for _ in range(5):
            record_failed_attempt(ip, user)
        blocked, remaining = check_rate_limit(ip, user)
        self.assertTrue(blocked, "Should be blocked after 5 failed attempts")
        self.assertGreater(remaining, 0, "Remaining seconds should be > 0")

    def test_sixth_attempt_blocked(self):
        ip, user = "5.6.7.8", "hacker"
        for _ in range(5):
            record_failed_attempt(ip, user)
        # 6th attempt
        blocked, remaining = check_rate_limit(ip, user)
        self.assertTrue(blocked)
        self.assertGreater(remaining, 250)  # should be close to 300

    def test_reset_clears_counter(self):
        ip, user = "9.9.9.9", "normaluser"
        for _ in range(5):
            record_failed_attempt(ip, user)
        blocked, _ = check_rate_limit(ip, user)
        self.assertTrue(blocked)

        reset_rate_limit(ip, user)
        blocked, _ = check_rate_limit(ip, user)
        self.assertFalse(blocked, "Should be unblocked after reset")

    def test_different_users_independent(self):
        ip = "1.1.1.1"
        for _ in range(5):
            record_failed_attempt(ip, "user_a")
        blocked_a, _ = check_rate_limit(ip, "user_a")
        blocked_b, _ = check_rate_limit(ip, "user_b")
        self.assertTrue(blocked_a)
        self.assertFalse(blocked_b, "Different usernames should have independent limits")

    def test_different_ips_independent(self):
        user = "victim"
        for _ in range(5):
            record_failed_attempt("10.0.0.1", user)
        blocked_ip1, _ = check_rate_limit("10.0.0.1", user)
        blocked_ip2, _ = check_rate_limit("10.0.0.2", user)
        self.assertTrue(blocked_ip1)
        self.assertFalse(blocked_ip2, "Different IPs should have independent limits")


@override_settings(
    CACHES={"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}}
)
class LoginViewRateLimitIntegrationTests(TestCase):
    """Integration tests: hit the actual login view and verify rate-limit responses."""

    def setUp(self):
        cache.clear()
        self.user = User.objects.create_user(
            username="fituser", password="Str0ngP@ss!", email="fit@test.com"
        )

    def tearDown(self):
        cache.clear()

    def test_normal_login_succeeds(self):
        resp = self.client.post(
            "/login/", {"username": "fituser", "password": "Str0ngP@ss!"}, follow=True
        )
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(resp.wsgi_request.user.is_authenticated)

    def test_wrong_password_shows_remaining_attempts(self):
        resp = self.client.post(
            "/login/", {"username": "fituser", "password": "wrong"}, follow=True
        )
        content = resp.content.decode()
        self.assertIn("4 attempt(s) remaining", content)

    def test_lockout_after_five_failures(self):
        for _ in range(5):
            self.client.post(
                "/login/", {"username": "fituser", "password": "wrong"}, follow=True
            )
        # 6th attempt should be blocked
        resp = self.client.post(
            "/login/", {"username": "fituser", "password": "wrong"}, follow=True
        )
        content = resp.content.decode()
        self.assertIn("Too many failed login attempts", content)

    def test_correct_login_resets_after_failures(self):
        for _ in range(3):
            self.client.post(
                "/login/", {"username": "fituser", "password": "wrong"}, follow=True
            )
        # Now login with correct credentials
        resp = self.client.post(
            "/login/", {"username": "fituser", "password": "Str0ngP@ss!"}, follow=True
        )
        self.assertTrue(resp.wsgi_request.user.is_authenticated)

        # Logout and verify counter was reset — next wrong attempt says 4 remaining
        self.client.logout()
        resp = self.client.post(
            "/login/", {"username": "fituser", "password": "wrong"}, follow=True
        )
        content = resp.content.decode()
        self.assertIn("4 attempt(s) remaining", content)


if __name__ == "__main__":
    import unittest
    unittest.main()
