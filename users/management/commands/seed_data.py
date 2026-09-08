from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from users.models import Package, Product, Profile, TrainerDetail, Client, WorkoutPlan, DietPlan, Measurement, Feedback, Notice


class Command(BaseCommand):
    help = "Populate FitMaster AI database with initial demo data"

    def handle(self, *args, **options):
        self.stdout.write("Seeding FitMaster AI database...")

        # Default Packages (3 Months, 6 Months, 1 Year)
        packages_data = [
            {"name": "3 Months Starter", "duration_months": 3, "price": 999, "description": "Basic access to gym equipment, workout guidelines, and standard support."},
            {"name": "6 Months Pro", "duration_months": 6, "price": 1999, "description": "Full access to gym facilities, assigned trainer diet plans, and monthly progress tracking."},
            {"name": "1 Year Elite", "duration_months": 12, "price": 3999, "description": "VIP membership with 1-on-1 personal trainer sessions, custom nutrition, and store discounts."},
        ]
        for p in packages_data:
            Package.objects.get_or_create(name=p["name"], defaults=p)

        # Default Store Products
        products_data = [
            {"name": "Gold Standard Whey Protein 1kg", "price": 2499, "description": "24g premium whey protein per serving to accelerate muscle recovery."},
            {"name": "Stainless Steel Fitness Shaker", "price": 499, "description": "Durable 750ml leak-proof stainless steel shaker bottle with wire whisk."},
            {"name": "Eco Non-Slip Yoga Mat 6mm", "price": 899, "description": "Extra thick high-density TPE yoga mat with anti-skid grip for home & studio."},
            {"name": "Adjustable Dumbbell Set 20kg", "price": 3499, "description": "Heavy-duty cast iron adjustable dumbbell plates with ergonomic spinlock collars."},
            {"name": "Resistance Bands Set (5 Pack)", "price": 699, "description": "Latex resistance loop bands with 5 resistance levels for home fitness workouts."},
        ]
        for prod in products_data:
            Product.objects.get_or_create(name=prod["name"], defaults=prod)

        # Seed Admin Superuser
        if not User.objects.filter(username="admin").exists():
            admin = User.objects.create_superuser("admin", "admin@fitmaster.ai", "admin123")
            Profile.objects.update_or_create(user=admin, defaults={"role": "admin"})
            self.stdout.write(self.style.SUCCESS("Created admin user (admin / admin123)"))

        # Seed Trainer Users (Gym, Yoga, Zumba)
        trainers_data = [
            {"username": "trainer_alex", "email": "alex@fitmaster.ai", "category": "gym"},
            {"username": "trainer_sarah", "email": "sarah@fitmaster.ai", "category": "yoga"},
            {"username": "trainer_mike", "email": "mike@fitmaster.ai", "category": "zumba"},
        ]
        for t_info in trainers_data:
            if not User.objects.filter(username=t_info["username"]).exists():
                user = User.objects.create_user(t_info["username"], t_info["email"], "trainer123")
                Profile.objects.update_or_create(user=user, defaults={"role": "trainer"})
                TrainerDetail.objects.update_or_create(user=user, defaults={"category": t_info["category"]})
                self.stdout.write(self.style.SUCCESS(f"Created trainer {t_info['username']} ({t_info['category']})"))

        # Seed Demo Customer
        if not User.objects.filter(username="john_doe").exists():
            cust = User.objects.create_user("john_doe", "john@example.com", "customer123")
            Profile.objects.update_or_create(user=cust, defaults={"role": "customer"})
            self.stdout.write(self.style.SUCCESS("Created demo customer (john_doe / customer123)"))

            # Assign to trainer_alex
            trainer = User.objects.get(username="trainer_alex")
            Client.objects.get_or_create(trainer=trainer, client=cust, defaults={"goal": "Weight Loss & Strength"})

            # Seed Workout Plan
            WorkoutPlan.objects.get_or_create(
                trainer=trainer, client=cust, title="Hypertrophy Split",
                defaults={"description": "Day 1: Chest & Triceps\nDay 2: Back & Biceps\nDay 3: Legs & Core", "duration": "60 Minutes"}
            )

            # Seed Diet Plan
            DietPlan.objects.get_or_create(
                trainer=trainer, client=cust,
                defaults={"breakfast": "Oatmeal with whey protein & banana", "lunch": "Grilled chicken breast with brown rice and broccoli", "dinner": "Salmon steak with avocado salad"}
            )

            # Seed Measurement
            Measurement.objects.get_or_create(customer=cust, month="2026-07-01", defaults={"weight": 78.0, "height": 178.0})

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))
