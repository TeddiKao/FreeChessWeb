from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from .models import BotGame
from core.utils import decide_bot_game_color

class CreateBotGameView(APIView):
    def post(self, request):
        try:
            bot_to_play_against = request.data.get("bot")
            colors = decide_bot_game_color()

            bot_game_id = BotGame.objects.create(
                human_player=request.user,
                bot=bot_to_play_against,
                white_player=colors["white"],
                black_player=colors["black"],
            ).id

            return Response({
                "game_id": bot_game_id,
            }, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)