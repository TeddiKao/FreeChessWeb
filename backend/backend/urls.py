from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
	path("users_api/", include("users_api.urls")),
	path("gameplay_api/", include("gameplay_api.urls"))
]
