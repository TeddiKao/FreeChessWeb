from django.shortcuts import render
from rest_framework.views import APIView

from gameplay.models import ChessGame
from core.utils import decide_bot_game_color

class CreateBotGameView(APIView):
    def post(self, request):
        bot_to_play_against = request.data.get("bot")
        colors = decide_bot_game_color()

        bot_game_id = ChessGame.objects.create(
            human_player=request.user,
            bot=bot_to_play_against,
            white_player=colors["white"],
            black_player=colors["black"],
        )

        return {
            "game_id": bot_game_id,
        }