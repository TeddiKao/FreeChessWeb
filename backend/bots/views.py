import copy
import traceback

from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from .models import BotGame
from core.utils import decide_bot_game_color

from move_validation.utils.general import get_opposite_color
from move_validation.utils.move_validation import validate_move
from move_validation.utils.get_move_type import get_move_type
from move_validation.utils.result_detection import get_is_stalemated, get_is_checkmated, is_threefold_repetiiton, check_50_move_rule_draw

from gameplay.utils.position_update import update_structured_fen
from gameplay.utils.game_state_history_update import update_position_list, update_move_list
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

class MakeMoveView(APIView):
    def post(self, request):
        try:
            move_info = request.data.get("move_info")
            game_id = request.data.get("game_id")
            
            bot_game: BotGame = BotGame.objects.filter(id=game_id).first()
            current_structured_fen = bot_game.get_full_structured_fen()
            current_board_placement = current_structured_fen["board_placement"]
            current_en_passant_target_square = current_structured_fen["en_passant_target_square"]

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

            move_type = get_move_type(current_board_placement, current_en_passant_target_square, move_info)

            if get_is_checkmated(new_structured_fen, get_opposite_color(move_info["piece_color"])):
                return Response({
                    "game_over": True,
                    "game_ended_cause": "checkmate",
                    "game_winner": move_info["piece_color"],

                    "new_structured_fen": new_structured_fen,
                    "new_position_list": bot_game.position_list,
                    "new_move_list": bot_game.move_list,
                    "move_type": move_type,
                })
            elif get_is_stalemated(new_structured_fen, get_opposite_color(move_info["piece_color"].lower())):
                return Response({
                    "game_over": True,
                    "game_ended_cause": "stalemate",
                    "game_winner": None,

                    "new_structured_fen": new_structured_fen,
                    "new_position_list": bot_game.position_list,
                    "new_move_list": bot_game.move_list,
                    "move_type": move_type,
                })
            
            elif is_threefold_repetiiton(bot_game.position_list, new_structured_fen):
                return Response({
                    "game_over": True,
                    "game_ended_cause": "repetition",
                    "game_winner": None,

                    "new_structured_fen": new_structured_fen,
                    "new_position_list": bot_game.position_list,
                    "new_move_list": bot_game.move_list,
                    "move_type": move_type,
                })
            
            elif check_50_move_rule_draw(bot_game.halfmove_clock):
                return Response({
                    "game_over": True,
                    "game_ended_cause": "50-move-rule",
                    "game_winner": None,

                    "new_structured_fen": new_structured_fen,
                    "new_position_list": bot_game.position_list,
                    "new_move_list": bot_game.move_list,
                    "move_type": move_type,
                })
            

            return Response({
                "game_over": False,
                "is_valid": True,
                "new_structured_fen": bot_game.get_full_structured_fen(),
                "new_position_list": bot_game.position_list,
                "new_move_list": bot_game.move_list,
                "move_type": move_type
            })
            
        except Exception as e:
            traceback.print_exc()

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