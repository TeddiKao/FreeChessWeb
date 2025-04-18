from django.urls import path
from .views import MatchmakingView

urlpatterns = [
	path("match-player/", MatchmakingView.as_view(), name="match_player")
]