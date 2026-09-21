import logging
from django.contrib.auth.models import User
from .models import Notification

logger = logging.getLogger(__name__)

def create_notification(user, title, message, notification_type="system", link=""):
    """
    Creates an in-app notification for a given user.
    """
    if not user or not user.is_authenticated:
        return None

    try:
        notif = Notification.objects.create(
            user=user,
            title=title,
            message=message,
            notification_type=notification_type,
            link=link or "",
            is_read=False,
        )
        return notif
    except Exception as e:
        logger.error(f"Failed to create notification for {user.username}: {e}")
        return None

def broadcast_role_notification(role, title, message, notification_type="notice", link=""):
    """
    Broadcast an in-app notification to all users or users matching a role.
    """
    if role == "all":
        users = User.objects.filter(is_active=True)
    elif role == "customer":
        users = User.objects.filter(profile__role="customer", is_active=True)
    elif role == "trainer":
        users = User.objects.filter(profile__role="trainer", is_active=True)
    else:
        users = User.objects.filter(is_active=True)

    notifications = []
    for u in users:
        notifications.append(
            Notification(
                user=u,
                title=title,
                message=message,
                notification_type=notification_type,
                link=link or "",
                is_read=False,
            )
        )

    if notifications:
        Notification.objects.bulk_create(notifications)
    return len(notifications)

def notify_welcome(user):
    """
    Creates a welcome notification for new users if one doesn't exist yet.
    """
    if not user or not user.is_authenticated:
        return None

    if not Notification.objects.filter(user=user, notification_type="welcome").exists():
        return create_notification(
            user=user,
            title="🎉 Welcome to FitMaster AI!",
            message="Your fitness journey begins now. Explore workout plans, track meals, and consult your trainer anytime.",
            notification_type="welcome",
            link="/customer-dashboard/" if getattr(getattr(user, "profile", None), "role", "") == "customer" else "/dashboard/",
        )
    return None

def notify_payment_success(user, amount_str, plan_name, invoice_id=None):
    """
    Creates a payment confirmation notification.
    """
    link = f"/invoice/{invoice_id}/" if invoice_id else "/transactions/"
    return create_notification(
        user=user,
        title="💳 Payment Successful",
        message=f"Your payment of {amount_str} for '{plan_name}' was completed successfully. Your invoice is ready.",
        notification_type="payment",
        link=link,
    )

def notify_workout_assigned(client_user, trainer_name, plan_title):
    """
    Notifies a client when a trainer assigns or updates a workout plan.
    """
    return create_notification(
        user=client_user,
        title="🏋️ New Workout Plan Assigned",
        message=f"Trainer {trainer_name} assigned a new workout routine: '{plan_title}'. Check it out now!",
        notification_type="workout",
        link="/my-plans/",
    )

def notify_diet_assigned(client_user, trainer_name):
    """
    Notifies a client when a trainer updates or assigns a diet plan.
    """
    return create_notification(
        user=client_user,
        title="🥗 Personalized Diet Plan Updated",
        message=f"Trainer {trainer_name} updated your personalized nutrition & meal schedule.",
        notification_type="diet",
        link="/my-plans/",
    )

def notify_schedule_created(client_user, trainer_name, date_str, time_str):
    """
    Notifies a client when a session is scheduled.
    """
    return create_notification(
        user=client_user,
        title="📅 Training Session Scheduled",
        message=f"Session with Trainer {trainer_name} scheduled on {date_str} at {time_str}.",
        notification_type="schedule",
        link="/customer-dashboard/",
    )

def notify_trainer_assignment(client_user, trainer_user):
    """
    Notifies both client and trainer upon assignment.
    """
    if client_user:
        create_notification(
            user=client_user,
            title="🤝 Personal Trainer Assigned",
            message=f"Coach {trainer_user.get_full_name() or trainer_user.username} is now your dedicated personal fitness trainer.",
            notification_type="trainer",
            link="/customer-dashboard/",
        )
    if trainer_user:
        create_notification(
            user=trainer_user,
            title="👤 New Client Assigned",
            message=f"{client_user.get_full_name() or client_user.username} has been assigned to your training roster.",
            notification_type="trainer",
            link="/trainer/my-clients/",
        )
