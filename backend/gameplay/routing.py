from django.urls import re_path
from .consumers import GameConsumer, GameActionConsumer

websocket_urlpatterns = [
	re_path("ws/game-server/", GameConsumer.as_asgi()),
	re_path("ws/action-server/", GameActionConsumer.as_asgi()) 
]