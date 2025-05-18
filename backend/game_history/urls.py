from django.urls import path

from .views import FetchCompletedGamesView, FetchGameWinnerView, GetTotalCompletedGamesView

urlpatterns = [
    path("get-completed-games/", FetchCompletedGamesView.as_view(), name="fetch_completed_games"),
    path("get-total-completed-games/", GetTotalCompletedGamesView.as_view(), name="get_total_completed_games"),
    path("get-game-winner/", FetchGameWinnerView.as_view(), name="fetch_game_winner"),
]