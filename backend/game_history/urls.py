from django.urls import path

from .views import FetchCompletedGamesView

urlpatterns = [
    path("get-game-history/", FetchCompletedGamesView.as_view(), name="fetch_completed_games")
]