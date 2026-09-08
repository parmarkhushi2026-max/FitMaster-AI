from django.urls import path
from . import views

urlpatterns = [
    # Health Check
    path('health/', views.health_check, name='health_check'),

    # Public
    path('', views.home, name='home'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.user_login, name='login'),
    path('forgot-password/', views.forgot_password, name='forgot_password'),
    path('auth/microsoft/', views.microsoft_login, name='microsoft_login'),
    path('logout/', views.logout_view, name='logout'),
    path('credentials-pdf/', views.download_credentials_pdf, name='download_credentials_pdf'),

    # Static pages
    path('membership/', views.membership, name='membership'),
    path('features/', views.features, name='features'),
    path('programs/', views.programs, name='programs'),
    path('trainers/', views.trainers, name='trainers'),
    path('contact/', views.contact, name='contact'),

    # Dashboard router
    path('dashboard/', views.dashboard, name='dashboard'),
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('customer-dashboard/', views.customer_dashboard, name='customer_dashboard'),
    path('trainer-dashboard/', views.trainer_dashboard, name='trainer_dashboard'),
    path('metrics/', views.metrics_dashboard, name='metrics'),
    path('log-measurement/', views.log_measurement, name='log_measurement'),
    path('update-water/', views.update_water, name='update_water'),
    path('update-set-status/', views.update_set_status, name='update_set_status'),
    path('add-workout-exercise/', views.add_workout_exercise, name='add_workout_exercise'),

    # Payment / Store
    path('payment/', views.payment, name='payment'),
    path('payment-success/', views.payment_success, name='payment_success'),
    path('checkout/', views.checkout, name='checkout'),
    path('store/', views.store, name='store'),
    path('transactions/', views.transaction_history, name='transactions'),
    path('invoice/<int:payment_id>/', views.invoice, name='invoice'),

    # Customer
    path('my-plans/', views.customer_plans, name='customer_plans'),
    path('settings/', views.settings, name='settings'),

    # Trainer
    path('trainer/workouts/', views.workout_plans, name='workout_plans'),
    path('trainer/diet/', views.diet_plans, name='diet_plans'),
    path('trainer/schedule/', views.schedule, name='schedule'),
    path('trainer/progress/', views.progress, name='progress'),
    path('trainer/my-clients/', views.my_clients, name='my_clients'),
    path('trainer/add-client/', views.add_client, name='add_client'),

    # Admin — Users
    path('admin/users/', views.users_list, name='users_list'),
    path('admin/users/<int:user_id>/edit/', views.edit_user, name='edit_user'),
    path('admin/users/<int:user_id>/delete/', views.delete_user, name='delete_user'),
    path('admin/trainers/', views.trainers_list, name='trainers_list'),
    path('admin/customers/', views.customers_list, name='customers_list'),
    path('admin/assign-trainer/', views.assign_trainer, name='assign_trainer'),

    # Admin — Management
    path('admin/packages/', views.admin_packages, name='admin_packages'),
    path('admin/products/', views.admin_products, name='admin_products'),
    path('admin/notices/', views.notices, name='notices'),

    # Platform Sync & AI Chatbot APIs
    path('api/chatbot/', views.chatbot_api, name='chatbot_api'),
    path('api/platform-sync/', views.platform_sync_api, name='platform_sync_api'),
]
