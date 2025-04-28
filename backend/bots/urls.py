from django.urls import path
from .views import CreateBotGameView, MakeMoveView

urlpatterns = [
    path("create-bot-game/", CreateBotGameView.as_view(), name="create_bot_game"),
    path("make-move/", MakeMoveView.as_view(), name="make_move")
]