from datetime import timedelta

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Package(models.Model):

    name = models.CharField(max_length=100, unique=True)

    duration_months = models.PositiveIntegerField()

    price = models.PositiveIntegerField()

    description = models.TextField(blank=True)

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.duration_months} months"

    @property
    def duration_days(self):
        return self.duration_months * 30



class Payment(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    name = models.CharField(max_length=100)

    plan = models.CharField(max_length=100)

    amount = models.IntegerField()

    card = models.CharField(max_length=20)

    transaction_type = models.CharField(
        max_length=20,
        choices=[
            ("membership", "Membership"),
            ("product", "Product"),
        ],
        default="membership",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.plan}"


class Product(models.Model):

    name = models.CharField(max_length=100)

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    image = models.CharField(
        max_length=200,
        blank=True
    )

    description = models.TextField(blank=True)

    def __str__(self):
        return self.name



class Profile(models.Model):

    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("customer", "Customer"),
        ("trainer", "Trainer"),
    )

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="customer"
    )

    def __str__(self):
        return f"{self.user.username} ({self.role})"


class TrainerDetail(models.Model):

    CATEGORY_CHOICES = (
        ("gym", "Gym"),
        ("yoga", "Yoga"),
        ("zumba", "Zumba"),
    )

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="trainer_detail",
    )

    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default="gym",
    )

    def __str__(self):
        return f"{self.user.username} - {self.get_category_display()}"


class Membership(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="memberships",
    )

    package = models.ForeignKey(
        Package,
        on_delete=models.PROTECT,
        related_name="memberships",
    )

    start_date = models.DateField(default=timezone.localdate)

    end_date = models.DateField(blank=True, null=True)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.package_id and self.start_date and not self.end_date:
            self.end_date = self.start_date + timedelta(days=self.package.duration_days)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.package.name}"


class Client(models.Model):

    trainer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="trainer_clients"
    )

    client = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="client_trainer"
    )

    goal = models.CharField(
        max_length=100,
        default="Weight Loss"
    )

    joined_on = models.DateField(
        auto_now_add=True
    )

    status = models.CharField(
        max_length=20,
        choices=[
            ("Active", "Active"),
            ("Inactive", "Inactive"),
        ],
        default="Active"
    )

    def __str__(self):
        return f"{self.client.username} → {self.trainer.username}"
  

class WorkoutPlan(models.Model):

    trainer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="workout_trainer"
    )

    client = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="workout_client"
    )

    title = models.CharField(
        max_length=100
    )

    description = models.TextField()

    duration = models.CharField(
        max_length=50,
        default="45 Minutes"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.client.username} - {self.title}"


class DietPlan(models.Model):

    trainer = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    client = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="diet_client"
    )

    breakfast = models.CharField(max_length=200)

    lunch = models.CharField(max_length=200)

    dinner = models.CharField(max_length=200)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.client.username
   

 
class Schedule(models.Model):

    trainer = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    client = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="schedule_client"
    )

    session_date = models.DateField()

    session_time = models.TimeField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.client.username} - {self.session_date}"

    # ==========================
# Progress Model
# ==========================

class Progress(models.Model):

    trainer = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    client = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="progress_client"
    )

    weight = models.FloatField()

    height = models.FloatField()

    bmi = models.FloatField()

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.client.username} Progress"


class Measurement(models.Model):

    customer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="measurements",
    )

    weight = models.FloatField()

    height = models.FloatField()

    bmi = models.FloatField(blank=True, null=True)

    month = models.DateField(default=timezone.localdate)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.height and self.weight and not self.bmi:
            try:
                h = float(self.height)
                w = float(self.weight)
                height_m = h / 100
                if height_m > 0:
                    self.bmi = round(w / (height_m * height_m), 2)
            except (ValueError, TypeError):
                pass
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.customer.username} - {self.month:%b %Y}"


class Feedback(models.Model):

    customer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="feedback",
    )

    rating = models.PositiveSmallIntegerField(default=5)

    message = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer.username} - {self.rating}/5"


class Notice(models.Model):

    RECIPIENT_CHOICES = (
        ("all", "All Users"),
        ("customer", "Customers"),
        ("trainer", "Trainers"),
    )

    subject = models.CharField(max_length=200)

    message = models.TextField()

    recipient_role = models.CharField(
        max_length=20,
        choices=RECIPIENT_CHOICES,
        default="all",
    )

    email_sent = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.subject


class EmailNotification(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='email_notifications', null=True, blank=True)
    recipient_email = models.EmailField(max_length=254)
    subject = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, default='General')
    sent_status = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    error_log = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.subject} to {self.recipient_email}"
