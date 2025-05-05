from django.urls import path

from .views import FetchCompletedGamesView, FetchGameWinnerView

urlpatterns = [
    path("get-completed-games/", FetchCompletedGamesView.as_view(), name="fetch_completed_games"),
    path("get-game-winner/", FetchGameWinnerView.as_view(), name="fetch_game_winner"),
]