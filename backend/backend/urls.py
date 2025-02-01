from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
	path("users_api/", include("users_api.urls")),
	path("gameplay_api/", include("gameplay_api.urls")),
	path("matchmaking_api/", include("matchmaking_api.urls")),
	path("move_validation_api/", include("move_validation_api.urls")),
]
