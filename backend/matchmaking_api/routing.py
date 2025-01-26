from .consumers import MatchmakingConsumer
from django.urls import path

websocket_urlpatterns = [
	path("ws/matchmaking/", MatchmakingConsumer.as_asgi())
]