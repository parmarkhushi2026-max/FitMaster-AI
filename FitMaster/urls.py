from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', include('users.urls')),
    path('django-admin/', admin.site.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Production Custom Error Handlers
handler404 = 'users.views.custom_404'
handler500 = 'users.views.custom_500'
handler403 = 'users.views.custom_403'
