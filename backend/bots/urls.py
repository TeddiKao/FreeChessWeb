from django.urls import path
from .views import CreateBotGameView

urls = [
    path("/create-bot-game/", CreateBotGameView.as_view(), name="create_bot_game")
]