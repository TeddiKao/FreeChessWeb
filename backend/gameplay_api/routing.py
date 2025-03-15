from django.urls import re_path
from .consumers import GameConsumer, ResignConsumer

websocket_urlpatterns = [
	re_path("ws/game-server/", GameConsumer.as_asgi()),
	re_path("ws/action-server/", ResignConsumer.as_asgi()) 
]