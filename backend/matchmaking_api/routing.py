from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
	re_path("ws/matchmaking-server/", consumers.MatchmakingConsumer.as_asgi())
]