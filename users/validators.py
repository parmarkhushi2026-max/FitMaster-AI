import re
from datetime import datetime, date
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

def sanitize_text(text, max_len=None):
    """
    Sanitizes string input by stripping whitespace and neutralizing potential script/HTML markup.
    """
    if not text:
        return ""
    cleaned = str(text).strip()
    # Remove potentially harmful script or HTML tags
    cleaned = re.sub(r'<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>', '', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'<[^>]+>', '', cleaned)
    if max_len and len(cleaned) > max_len:
        cleaned = cleaned[:max_len]
    return cleaned.strip()

def validate_username(username):
    """
    Validates username: must be 3-30 characters, alphanumeric, underscores, or hyphens.
    """
    username = sanitize_text(username)
    if not username:
        return False, "Username cannot be empty."
    if len(username) < 3 or len(username) > 30:
        return False, "Username must be between 3 and 30 characters long."
    if not re.match(r'^[a-zA-Z0-9_-]+$', username):
        return False, "Username can only contain letters, numbers, underscores, and hyphens."
    return True, username

def validate_email_format(email):
    """
    Validates RFC standard email format using Django's EmailValidator.
    """
    email = sanitize_text(email)
    if not email:
        return False, "Email address cannot be empty."
    try:
        validate_email(email)
        return True, email.lower()
    except ValidationError:
        return False, "Please provide a valid email address (e.g. user@example.com)."

def validate_phone_format(phone):
    """
    Validates mobile phone number format (optional leading +, 7 to 15 digits).
    """
    if not phone:
        return True, ""  # Optional field
    cleaned = re.sub(r'[^\d+]', '', str(phone)).strip()
    if not cleaned:
        return True, ""
    if not re.match(r'^\+?[0-9]{7,15}$', cleaned):
        return False, "Please enter a valid phone number (e.g. +919876543210 or 10-12 digits)."
    return True, cleaned

def validate_password_strength(password):
    """
    Validates password strength: minimum 6 characters, non-empty.
    """
    if not password:
        return False, "Password cannot be empty."
    if len(str(password)) < 6:
        return False, "Password must be at least 6 characters long."
    return True, password

def validate_positive_number(val, field_name="Value", min_val=0.01, max_val=None):
    """
    Validates that a numeric input is a valid positive number within optional bounds.
    """
    if val is None or str(val).strip() == "":
        return False, f"{field_name} is required."
    try:
        num = float(val)
        if num < min_val:
            return False, f"{field_name} must be greater than or equal to {min_val}."
        if max_val is not None and num > max_val:
            return False, f"{field_name} cannot exceed {max_val}."
        return True, num
    except (ValueError, TypeError):
        return False, f"Please enter a valid numeric value for {field_name}."

def validate_date_string(date_str, field_name="Date"):
    """
    Validates that a string is a valid date (YYYY-MM-DD or standard formats).
    """
    if not date_str:
        return False, f"{field_name} is required."
    cleaned = sanitize_text(date_str)
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%Y/%m/%d"):
        try:
            parsed = datetime.strptime(cleaned, fmt).date()
            return True, parsed
        except ValueError:
            pass
    return False, f"Please enter a valid date format for {field_name} (YYYY-MM-DD)."

def validate_time_string(time_str, field_name="Time"):
    """
    Validates that a string is a valid time (HH:MM or HH:MM AM/PM).
    """
    if not time_str:
        return False, f"{field_name} is required."
    cleaned = sanitize_text(time_str)
    for fmt in ("%H:%M", "%H:%M:%S", "%I:%M %p", "%I:%M%p"):
        try:
            parsed = datetime.strptime(cleaned, fmt).time()
            return True, parsed
        except ValueError:
            pass
    return False, f"Please enter a valid time format for {field_name} (HH:MM)."
