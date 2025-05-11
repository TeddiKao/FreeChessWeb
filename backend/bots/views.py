import copy
import traceback

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

            bot_game: BotGame = BotGame.objects.create(
                human_player=request.user,
                bot=bot_to_play_against,
                white_player=colors["white"],
                black_player=colors["black"],
            )

            return Response({
                "game_id": bot_game.id,
                "assigned_color": bot_game.get_player_color()
            }, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)

class GetBotGameMoveListView(APIView):
    def post(self, request):
        game_id = request.data.get("game_id")

        bot_game: BotGame | None = BotGame.objects.filter(id=game_id).first()
        if not bot_game:
            return Response("Not found!", status=status.HTTP_404_NOT_FOUND)

        return Response({
            "move_list": bot_game.move_list
        }, status=status.HTTP_200_OK)
    
class GetBotGamePositionListView(APIView):
    def post(self, request):
        game_id = request.data.get("game_id")

        bot_game: BotGame | None = BotGame.objects.filter(id=game_id).first()
        if not bot_game:
            return Response("Not found!", status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            "position_list": bot_game.position_list
        }, status=status.HTTP_200_OK)