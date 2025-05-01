from django.urls import re_path
from .consumers import BotGameConsumer

websocket_urlpatterns = [
    re_path("/bot-game-server/", BotGameConsumer.as_asgi())
]