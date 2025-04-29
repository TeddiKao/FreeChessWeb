import copy

from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from .models import BotGame
from core.utils import decide_bot_game_color
from move_validation.utils.move_validation import validate_move

from gameplay.utils.position_update import update_structured_fen
from gameplay.utils.game_state_history_update import update_position_list, update_move_list
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

            current_position_list = bot_game.position_list
            current_move_list = bot_game.move_list

            new_move_list = update_move_list(current_structured_fen, current_move_list, move_info)
            
            
            new_structured_fen = update_structured_fen(current_structured_fen, move_info)                
            
            
            new_position_list = update_position_list(current_position_list, move_info, new_structured_fen)

            

            bot_game.update_full_structured_fen(new_structured_fen)
            bot_game.update_move_list(new_move_list)
            bot_game.update_position_list(new_position_list)

            return Response({
                "is_valid": True,
                "new_structured_fen": bot_game.get_full_structured_fen(),
                "new_position_list": bot_game.position_list,
                "new_move_list": bot_game.move_list
            })
            
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