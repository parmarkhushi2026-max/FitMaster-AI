from django.contrib import admin

from .models import (
    Payment,
    Product,
    Profile,
    Package,
    Membership,
    TrainerDetail,
    Client,
    WorkoutPlan,
    DietPlan,
    Schedule,
    Progress,
    Measurement,
    Feedback,
    Notice,
    EmailNotification,
)




@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "user",
        "name",
        "plan",
        "amount",
        "transaction_type",
        "created_at",
    )

    list_filter = (
        "transaction_type",
        "created_at",
    )

    search_fields = (
        "name",
        "plan",
        "user__username",
    )

    ordering = (
        "-created_at",
    )



@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "name",
        "price",
    )

    search_fields = (
        "name",
    )

    ordering = (
        "name",
    )


@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "name",
        "duration_months",
        "price",
        "is_active",
    )

    list_filter = (
        "is_active",
    )

    search_fields = (
        "name",
    )


@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "user",
        "package",
        "start_date",
        "end_date",
        "is_active",
    )

    list_filter = (
        "is_active",
        "package",
    )

    search_fields = (
        "user__username",
        "package__name",
    )


@admin.register(TrainerDetail)
class TrainerDetailAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "user",
        "category",
    )

    list_filter = (
        "category",
    )




@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "user",
        "role",
    )

    list_filter = (
        "role",
    )

    search_fields = (
        "user__username",
    )

    ordering = (
        "user",
    )




@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "trainer",
        "client",
        "goal",
        "status",
        "joined_on",
    )

    list_filter = (
        "status",
    )

    search_fields = (
        "trainer__username",
        "client__username",
        "goal",
    )

    ordering = (
        "-joined_on",
    )



@admin.register(WorkoutPlan)
class WorkoutPlanAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "trainer",
        "client",
        "title",
        "duration",
        "created_at",
    )

    search_fields = (
        "client__username",
        "trainer__username",
        "title",
    )

    ordering = (
        "-created_at",
    )




@admin.register(DietPlan)
class DietPlanAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "trainer",
        "client",
        "created_at",
    )

    search_fields = (
        "client__username",
        "trainer__username",
    )

    ordering = (
        "-created_at",
    )



@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "trainer",
        "client",
        "session_date",
        "session_time",
        "created_at",
    )

    search_fields = (
        "client__username",
        "trainer__username",
    )

    ordering = (
        "-created_at",
    )




@admin.register(Progress)
class ProgressAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "trainer",
        "client",
        "weight",
        "height",
        "bmi",
        "created_at",
    )

    search_fields = (
        "client__username",
        "trainer__username",
    )

    ordering = (
        "-created_at",
    )


@admin.register(Measurement)
class MeasurementAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "customer",
        "weight",
        "height",
        "bmi",
        "month",
    )

    search_fields = (
        "customer__username",
    )


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "customer",
        "rating",
        "created_at",
    )

    search_fields = (
        "customer__username",
        "message",
    )


@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "subject",
        "recipient_role",
        "email_sent",
        "created_at",
    )

    list_filter = (
        "recipient_role",
        "email_sent",
    )


@admin.register(EmailNotification)
class EmailNotificationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "recipient",
        "recipient_email",
        "subject",
        "notification_type",
        "sent_status",
        "created_at",
    )
    list_filter = (
        "sent_status",
        "notification_type",
        "created_at",
    )
    search_fields = (
        "recipient__username",
        "recipient_email",
        "subject",
        "message",
    )
    readonly_fields = (
        "created_at",
    )
    ordering = (
        "-created_at",
    )

