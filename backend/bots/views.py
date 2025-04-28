import copy

from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from .models import BotGame
from core.utils import decide_bot_game_color
from move_validation.utils.move_validation import validate_move
from gameplay.utils.position_update import update_structured_fen

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

class MakeMoveView(APIView):
    def post(self, request):
        try:
            move_info = request.data.get("move_info")
            game_id = request.data.get("game_id")
            
            bot_game: BotGame = BotGame.objects.filter(id=game_id).first()
            current_structured_fen = bot_game.get_full_structured_fen()

            is_move_valid = validate_move(current_structured_fen, move_info)
            if not is_move_valid:
                return Response({
                    "is_valid": False
                }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

            new_structured_fen = update_structured_fen(current_structured_fen, move_info)                
            bot_game.update_full_structured_fen(new_structured_fen)

            return Response({
                "is_valid": True,
                "new_structured_fen": bot_game.get_full_structured_fen()
            })
            
        except Exception as e:
            print(e)