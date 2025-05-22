from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
	path("users_api/", include("users.urls")),
	path("gameplay_api/", include("gameplay.urls")),
	path("matchmaking_api/", include("matchmaking.urls")),
	path("move_validation_api/", include("move_validation.urls")),
	path("bots/", include("bots.urls")),
    path("game-history/", include("game_history.urls")),
    path("core/", include("core.urls")),
]
