from datetime import date
from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse

from .models import (
    Client, DietPlan, Feedback, Measurement, Membership,
    Notice, Package, Payment, Profile, Progress, Product,
    Schedule, TrainerDetail, WorkoutPlan
)


class FitMasterWorkflowTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="Admin@12345",
        )
        self.admin.profile.role = "admin"
        self.admin.profile.save()

        self.trainer = User.objects.create_user(
            username="trainer",
            email="trainer@example.com",
            password="Trainer@12345",
        )
        self.trainer.profile.role = "trainer"
        self.trainer.profile.save()
        TrainerDetail.objects.create(user=self.trainer, category="gym")

        self.customer = User.objects.create_user(
            username="customer",
            email="customer@example.com",
            password="Customer@12345",
        )

        self.package_3m = Package.objects.create(
            name="3 Months Special",
            duration_months=3,
            price=999,
            description="3 months access",
        )
        self.package_6m = Package.objects.create(
            name="6 Months Pro",
            duration_months=6,
            price=1999,
            description="6 months access",
        )
        self.package_1y = Package.objects.create(
            name="1 Year Elite",
            duration_months=12,
            price=3999,
            description="1 year access",
        )

        self.product = Product.objects.create(
            name="Whey Protein 1kg",
            price=2499.00,
            description="High quality protein supplement",
        )

    def test_signup_creates_user_profile_and_login_redirects_to_dashboard(self):
        response = self.client.post(
            reverse("signup"),
            {
                "username": "newcustomer",
                "email": "newcustomer@example.com",
                "password": "StrongPass123",
                "confirm_password": "StrongPass123",
                "role": "customer",
            },
        )
        self.assertRedirects(response, reverse("login"))
        user = User.objects.get(username="newcustomer")
        self.assertEqual(user.profile.role, "customer")

        logged_in = self.client.login(username="newcustomer", password="StrongPass123")
        self.assertTrue(logged_in)
        response = self.client.get(reverse("dashboard"))
        self.assertRedirects(response, reverse("customer_dashboard"))

    def test_trainer_signup_with_category(self):
        response = self.client.post(
            reverse("signup"),
            {
                "username": "yogatrainer",
                "email": "yoga@example.com",
                "password": "StrongPass123",
                "confirm_password": "StrongPass123",
                "role": "trainer",
                "category": "yoga",
            },
        )
        self.assertRedirects(response, reverse("login"))
        user = User.objects.get(username="yogatrainer")
        self.assertEqual(user.profile.role, "trainer")
        self.assertEqual(user.trainer_detail.category, "yoga")

    def test_admin_and_trainer_dashboards_are_role_protected(self):
        self.client.login(username="admin", password="Admin@12345")
        response = self.client.get(reverse("dashboard"))
        self.assertRedirects(response, reverse("admin_dashboard"))

        response = self.client.get(reverse("trainer_dashboard"))
        self.assertRedirects(
            response,
            reverse("dashboard"),
            fetch_redirect_response=False,
        )

        self.client.logout()
        self.client.login(username="trainer", password="Trainer@12345")
        response = self.client.get(reverse("dashboard"))
        self.assertRedirects(response, reverse("trainer_dashboard"))

    def test_membership_payment_creates_membership(self):
        self.client.login(username="customer", password="Customer@12345")
        response = self.client.get(reverse("payment"), {"plan": "3 Months Special", "price": "999"})
        self.assertEqual(response.status_code, 200)

        response = self.client.post(
            reverse("payment"),
            {
                "plan": "3 Months Special",
                "price": "999",
                "name": "Customer Test",
                "card": "4111111111111111",
            },
        )

        self.assertRedirects(response, reverse("payment_success"))
        payment = Payment.objects.get(user=self.customer)
        self.assertEqual(payment.transaction_type, "membership")
        self.assertEqual(payment.amount, 999)
        self.assertEqual(payment.card, "1111")

        membership = Membership.objects.get(user=self.customer, is_active=True)
        self.assertEqual(membership.package, self.package_3m)

    def test_checkout_store_product(self):
        self.client.login(username="customer", password="Customer@12345")
        response = self.client.get(reverse("checkout"), {"product": self.product.id})
        self.assertEqual(response.status_code, 200)

        response = self.client.get(reverse("checkout"), {"product": 99999})
        self.assertRedirects(response, reverse("store"))

    def test_customer_height_weight_measurement_and_feedback(self):
        self.client.login(username="customer", password="Customer@12345")
        response = self.client.post(
            reverse("customer_plans"),
            {
                "action": "measurement",
                "weight": "75.0",
                "height": "175",
                "month": "2026-07-01",
            },
        )
        self.assertRedirects(response, reverse("customer_plans"))
        m = Measurement.objects.get(customer=self.customer)
        self.assertEqual(m.weight, 75.0)
        self.assertEqual(m.height, 175)
        self.assertEqual(m.bmi, 24.49)

        response = self.client.post(
            reverse("customer_plans"),
            {
                "action": "feedback",
                "rating": "5",
                "message": "Great gym experience!",
            },
        )
        self.assertRedirects(response, reverse("customer_plans"))
        fb = Feedback.objects.get(customer=self.customer)
        self.assertEqual(fb.rating, 5)
        self.assertEqual(fb.message, "Great gym experience!")

    def test_trainer_can_manage_assigned_client_workflows(self):
        Client.objects.create(
            trainer=self.trainer,
            client=self.customer,
            goal="Muscle Gain",
        )
        self.client.login(username="trainer", password="Trainer@12345")

        response = self.client.post(
            reverse("workout_plans"),
            {
                "client": self.customer.id,
                "title": "Strength",
                "description": "Upper body strength plan",
                "duration": "45 Minutes",
            },
        )
        self.assertRedirects(response, reverse("workout_plans"))
        self.assertEqual(WorkoutPlan.objects.count(), 1)

        response = self.client.post(
            reverse("diet_plans"),
            {
                "client": self.customer.id,
                "breakfast": "Oats",
                "lunch": "Rice and dal",
                "dinner": "Paneer and salad",
            },
        )
        self.assertRedirects(response, reverse("diet_plans"))
        self.assertEqual(DietPlan.objects.count(), 1)

        response = self.client.post(
            reverse("schedule"),
            {
                "client": self.customer.id,
                "session_date": "2026-07-29",
                "session_time": "09:30",
            },
        )
        self.assertRedirects(response, reverse("schedule"))
        self.assertEqual(Schedule.objects.count(), 1)

        response = self.client.post(
            reverse("progress"),
            {
                "client": self.customer.id,
                "weight": "72.5",
                "height": "170",
                "bmi": "25.1",
                "notes": "Improving stamina",
            },
        )
        self.assertRedirects(response, reverse("progress"))
        self.assertEqual(Progress.objects.count(), 1)

    def test_admin_package_product_notice_and_edit_user(self):
        self.client.login(username="admin", password="Admin@12345")

        # Admin Package Creation
        response = self.client.post(
            reverse("admin_packages"),
            {
                "name": "Super 1 Year",
                "duration_months": 12,
                "price": 4999,
                "description": "VIP Package",
                "is_active": "on",
            },
        )
        self.assertRedirects(response, reverse("admin_packages"))
        self.assertTrue(Package.objects.filter(name="Super 1 Year").exists())

        # Admin Edit User & Set Start/End Dates
        response = self.client.post(
            reverse("edit_user", args=[self.customer.id]),
            {
                "first_name": "John",
                "last_name": "Doe",
                "email": "johndoe@example.com",
                "is_active": "on",
                "role": "customer",
                "membership": self.package_3m.id,
                "start_date": "2026-08-01",
                "end_date": "2026-11-01",
            },
        )
        self.assertRedirects(response, reverse("users_list"))
        self.customer.refresh_from_db()
        self.assertEqual(self.customer.first_name, "John")
        membership = Membership.objects.get(user=self.customer, is_active=True)
        self.assertEqual(str(membership.start_date), "2026-08-01")
        self.assertEqual(str(membership.end_date), "2026-11-01")

        # Admin Product Management
        response = self.client.post(
            reverse("admin_products"),
            {
                "action": "save",
                "name": "Creatine Monohydrate",
                "price": "1200",
                "description": "Pure creatine powder",
            },
        )
        self.assertRedirects(response, reverse("admin_products"))
        self.assertTrue(Product.objects.filter(name="Creatine Monohydrate").exists())

        # Admin Send Notice
        response = self.client.post(
            reverse("notices"),
            {
                "subject": "Gym Holiday Announcement",
                "message": "The gym will remain closed on Sunday.",
                "recipient_role": "all",
            },
        )
        self.assertRedirects(response, reverse("notices"))
        self.assertTrue(Notice.objects.filter(subject="Gym Holiday Announcement").exists())

    def test_health_check_endpoint(self):
        response = self.client.get(reverse("health_check"))
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        self.assertEqual(data["service"], "FitMaster")
        self.assertEqual(data["database"], "connected")

    def test_forgot_password_workflow(self):
        response = self.client.get(reverse("forgot_password"))
        self.assertEqual(response.status_code, 200)

        response = self.client.post(
            reverse("forgot_password"),
            {
                "identity": "customer",
                "new_password": "NewSecretPass123",
                "confirm_password": "NewSecretPass123",
            },
        )
        self.assertRedirects(response, reverse("login"))

        logged_in = self.client.login(username="customer", password="NewSecretPass123")
        self.assertTrue(logged_in)

