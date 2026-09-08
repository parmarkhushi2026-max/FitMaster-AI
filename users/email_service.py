import logging

from django.conf import settings
from django.contrib.auth.models import User
from django.core.mail import send_mail

from .models import EmailNotification


logger = logging.getLogger(__name__)


class EmailService:
    """
    Central email service for FitMaster AI.

    This service:
    1. Sends emails using Django's email system.
    2. Saves every email attempt in EmailNotification.
    3. Records success/failure status.
    4. Stores error messages when an email fails.
    """

    @staticmethod
    def send_notification(
        subject,
        message,
        recipient_email,
        recipient_user=None,
        notification_type="General",
    ):
        """
        Send an email and save the notification in the database.
        """

        # -------------------------------------------------
        # Validate recipient email
        # -------------------------------------------------

        if not recipient_email:
            logger.warning(
                "Email not sent because recipient email is empty."
            )
            return False

        # -------------------------------------------------
        # Create notification record
        # -------------------------------------------------

        notification = EmailNotification(
            recipient=recipient_user,
            recipient_email=recipient_email,
            subject=subject,
            message=message,
            notification_type=notification_type,
            sent_status=False,
        )

        try:
            # -------------------------------------------------
            # Sender email
            # -------------------------------------------------

            from_email = settings.DEFAULT_FROM_EMAIL

            if not from_email:
                from_email = settings.EMAIL_HOST_USER

            # -------------------------------------------------
            # Send email
            # -------------------------------------------------

            send_mail(
                subject=subject,
                message=message,
                from_email=from_email,
                recipient_list=[recipient_email],
                fail_silently=False,
            )

            # -------------------------------------------------
            # Email sent successfully
            # -------------------------------------------------

            notification.sent_status = True
            notification.error_log = ""

            logger.info(
                "Email sent successfully to %s - Subject: %s",
                recipient_email,
                subject,
            )

        except Exception as e:
            # -------------------------------------------------
            # Email failed
            # -------------------------------------------------

            error_message = str(e)

            notification.sent_status = False
            notification.error_log = error_message

            logger.error(
                "Failed to send email to %s: %s",
                recipient_email,
                error_message,
                exc_info=True,
            )

        finally:
            # -------------------------------------------------
            # Always save notification in database
            # -------------------------------------------------

            notification.save()

        return notification.sent_status

    # =====================================================
    # BROADCAST NOTICE
    # =====================================================

    @staticmethod
    def broadcast_notice(notice):
        """
        Send a notice to users according to the selected role.

        Supported roles:
        - all
        - customer
        - trainer
        """

        # -------------------------------------------------
        # Select users
        # -------------------------------------------------

        if notice.recipient_role == "all":

            users = User.objects.all()

        elif notice.recipient_role == "customer":

            users = User.objects.filter(
                profile__role="customer"
            )

        elif notice.recipient_role == "trainer":

            users = User.objects.filter(
                profile__role="trainer"
            )

        else:

            logger.warning(
                "Invalid recipient role: %s",
                notice.recipient_role,
            )

            return 0

        # -------------------------------------------------
        # Send emails
        # -------------------------------------------------

        success_count = 0

        for user in users:

            if not user.email:
                logger.warning(
                    "Skipping user %s because email is empty.",
                    user.username,
                )
                continue

            success = EmailService.send_notification(
                subject=notice.subject,
                message=notice.message,
                recipient_email=user.email,
                recipient_user=user,
                notification_type="Broadcast",
            )

            if success:
                success_count += 1

        logger.info(
            "Broadcast completed. %s emails sent successfully.",
            success_count,
        )

        return success_count
