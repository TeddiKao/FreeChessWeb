from django.urls import path
from .views import CreateBotGameView, MakeMoveView, GetBotGamePositionListView, GetBotGameMoveListView

urlpatterns = [
    path("create-bot-game/", CreateBotGameView.as_view(), name="create_bot_game"),
    path("make-move/", MakeMoveView.as_view(), name="make_move"),
    path("get-position-list/", GetBotGamePositionListView.as_view(), name="get_bot_game_position_list"),
    path("get-move-list/", GetBotGameMoveListView.as_view(), name="get_bot_game_move_list")
]