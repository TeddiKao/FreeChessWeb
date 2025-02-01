from django.urls import re_path
from .consumers import GameConsumer

websocket_urlpatterns = [
	re_path("ws/game-server/", GameConsumer.as_asgi())
]