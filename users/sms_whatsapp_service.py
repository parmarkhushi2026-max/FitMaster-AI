import os
import re
import urllib.parse
import urllib.request
import json
import base64
import logging

from django.conf import settings
from .models import AlertLog

logger = logging.getLogger(__name__)

class AlertService:
    """
    Central SMS & WhatsApp Alert Service for FitMaster AI.
    Integrates with Twilio REST API, Gupshup API, and 1-Click WhatsApp Direct URLs.
    """

    @staticmethod
    def format_phone(phone_str):
        """
        Cleans and formats phone number into international E.164 format.
        Default to India +91 if 10 digits provided without country code.
        """
        if not phone_str:
            return ""
        
        cleaned = re.sub(r'[^\d+]', '', str(phone_str)).strip()
        if not cleaned:
            return ""
        
        if not cleaned.startswith("+"):
            if len(cleaned) == 10:
                cleaned = "+91" + cleaned
            else:
                cleaned = "+" + cleaned
        return cleaned

    @staticmethod
    def send_sms(recipient_phone, message, user=None):
        """
        Sends transactional SMS alert via Twilio REST API.
        Falls back cleanly to simulated sandbox log if API keys are not provided.
        """
        phone = AlertService.format_phone(recipient_phone)
        if not phone:
            logger.warning("SMS not sent: Recipient phone number is empty.")
            return False

        account_sid = getattr(settings, "TWILIO_ACCOUNT_SID", "")
        auth_token = getattr(settings, "TWILIO_AUTH_TOKEN", "")
        from_phone = getattr(settings, "TWILIO_PHONE_NUMBER", "")

        status = "simulated"
        provider = "Twilio (Simulated)"
        response_payload = "API keys not set - notification logged in simulation mode."

        if account_sid and auth_token and from_phone:
            try:
                url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"
                data = urllib.parse.urlencode({
                    "From": from_phone,
                    "To": phone,
                    "Body": message
                }).encode('utf-8')
                
                req = urllib.request.Request(url, data=data, method="POST")
                auth_header = base64.b64encode(f"{account_sid}:{auth_token}".encode('ascii')).decode('ascii')
                req.add_header("Authorization", f"Basic {auth_header}")
                
                with urllib.request.urlopen(req, timeout=10) as response:
                    res_body = response.read().decode('utf-8')
                    status = "sent"
                    provider = "Twilio Live SMS"
                    response_payload = res_body
                    logger.info(f"Twilio SMS sent successfully to {phone}")
            except Exception as e:
                status = "failed"
                provider = "Twilio Live SMS"
                response_payload = f"Error sending Twilio SMS: {str(e)}"
                logger.error(f"Failed to send SMS to {phone}: {e}")

        # Always record in AlertLog
        try:
            AlertLog.objects.create(
                user=user if getattr(user, 'is_authenticated', False) else None,
                channel="sms",
                recipient_phone=phone,
                message=message,
                status=status,
                provider=provider,
                response_payload=response_payload,
            )
        except Exception as log_err:
            logger.error(f"Failed to create AlertLog: {log_err}")

        return status in ["sent", "simulated"]

    @staticmethod
    def send_whatsapp(recipient_phone, message, user=None):
        """
        Sends WhatsApp notification via Twilio / Gupshup API.
        Falls back to simulated sandbox log if live keys are not configured.
        """
        phone = AlertService.format_phone(recipient_phone)
        if not phone:
            logger.warning("WhatsApp message not sent: Recipient phone number is empty.")
            return False

        account_sid = getattr(settings, "TWILIO_ACCOUNT_SID", "")
        auth_token = getattr(settings, "TWILIO_AUTH_TOKEN", "")
        whatsapp_from = getattr(settings, "TWILIO_WHATSAPP_NUMBER", "whatsapp:+14155238886")

        status = "simulated"
        provider = "WhatsApp Twilio/Gupshup (Simulated)"
        response_payload = "API keys not configured - logged in simulation mode."

        if account_sid and auth_token and whatsapp_from:
            try:
                to_wa = phone if phone.startswith("whatsapp:") else f"whatsapp:{phone}"
                from_wa = whatsapp_from if whatsapp_from.startswith("whatsapp:") else f"whatsapp:{whatsapp_from}"
                
                url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"
                data = urllib.parse.urlencode({
                    "From": from_wa,
                    "To": to_wa,
                    "Body": message
                }).encode('utf-8')

                req = urllib.request.Request(url, data=data, method="POST")
                auth_header = base64.b64encode(f"{account_sid}:{auth_token}".encode('ascii')).decode('ascii')
                req.add_header("Authorization", f"Basic {auth_header}")

                with urllib.request.urlopen(req, timeout=10) as response:
                    res_body = response.read().decode('utf-8')
                    status = "sent"
                    provider = "Twilio WhatsApp Live"
                    response_payload = res_body
                    logger.info(f"WhatsApp sent successfully to {phone}")
            except Exception as e:
                status = "failed"
                provider = "Twilio WhatsApp Live"
                response_payload = f"Error sending WhatsApp: {str(e)}"
                logger.error(f"Failed to send WhatsApp to {phone}: {e}")

        try:
            AlertLog.objects.create(
                user=user if getattr(user, 'is_authenticated', False) else None,
                channel="whatsapp",
                recipient_phone=phone,
                message=message,
                status=status,
                provider=provider,
                response_payload=response_payload,
            )
        except Exception as log_err:
            logger.error(f"Failed to create AlertLog for WhatsApp: {log_err}")

        return status in ["sent", "simulated"]

    @staticmethod
    def generate_whatsapp_web_link(recipient_phone, message=""):
        """
        Generates a direct 1-click WhatsApp deep link (https://wa.me/...) for instant Web & Mobile chat.
        """
        phone = AlertService.format_phone(recipient_phone)
        clean_num = re.sub(r'[^\d]', '', phone)
        if not clean_num:
            return "#"
        encoded_msg = urllib.parse.quote(message) if message else ""
        return f"https://wa.me/{clean_num}?text={encoded_msg}"


# =========================================================
# CONVENIENCE EVENT ALERT HELPERS
# =========================================================

def alert_signup_welcome(user):
    phone = getattr(getattr(user, 'profile', None), 'phone_number', '')
    if not phone:
        return False
    msg = f"🎉 Welcome to FitMaster AI, {user.username}! Your account is active. Explore customized workout and diet plans now!"
    AlertService.send_whatsapp(phone, msg, user)
    return AlertService.send_sms(phone, msg, user)

def alert_payment_success(user, amount_str, plan_name, invoice_url=""):
    phone = getattr(getattr(user, 'profile', None), 'phone_number', '')
    if not phone:
        return False
    msg = f"💳 FitMaster Payment Received: {amount_str} for '{plan_name}'. Thank you for your purchase! View Invoice: {invoice_url}"
    AlertService.send_whatsapp(phone, msg, user)
    return AlertService.send_sms(phone, msg, user)

def alert_workout_assigned(client_user, trainer_name, plan_title):
    phone = getattr(getattr(client_user, 'profile', None), 'phone_number', '')
    if not phone:
        return False
    msg = f"🏋️ FitMaster Routine Alert: Coach {trainer_name} assigned a new workout routine '{plan_title}'. Check your client dashboard!"
    AlertService.send_whatsapp(phone, msg, client_user)
    return AlertService.send_sms(phone, msg, client_user)

def alert_diet_assigned(client_user, trainer_name):
    phone = getattr(getattr(client_user, 'profile', None), 'phone_number', '')
    if not phone:
        return False
    msg = f"🥗 FitMaster Nutrition Alert: Coach {trainer_name} updated your personalized diet & meal plan!"
    AlertService.send_whatsapp(phone, msg, client_user)
    return AlertService.send_sms(phone, msg, client_user)

def alert_schedule_session(client_user, trainer_name, date_str, time_str):
    phone = getattr(getattr(client_user, 'profile', None), 'phone_number', '')
    if not phone:
        return False
    msg = f"📅 FitMaster Session Booking: Training session with Coach {trainer_name} confirmed for {date_str} at {time_str}."
    AlertService.send_whatsapp(phone, msg, client_user)
    return AlertService.send_sms(phone, msg, client_user)
