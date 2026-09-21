from django import template
from users.models import Notification
from users.notification_service import notify_welcome

register = template.Library()

@register.inclusion_tag('includes/notification_bell.html', takes_context=True)
def render_notifications(context):
    request = context.get('request')
    notifications = []
    unread_count = 0
    if request and request.user.is_authenticated:
        # If user has no notifications yet, give them a welcome notification
        if not Notification.objects.filter(user=request.user).exists():
            notify_welcome(request.user)

        notifications = Notification.objects.filter(user=request.user).order_by('-created_at')[:7]
        unread_count = Notification.objects.filter(user=request.user, is_read=False).count()
    return {
        'notifications': notifications,
        'unread_count': unread_count,
        'request': request,
    }

