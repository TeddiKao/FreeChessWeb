import traceback

from django.shortcuts import render
from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from gameplay.models import ChessGame
from core.utils.model_utils import serialize_models_including_fields, sort_serialized_models

# Create your views here.
class FetchCompletedGamesView(APIView):
    def post(self, request):
        try:
            user = request.user
            fields_to_include = ["id", "white_player", "black_player", "game_winner", "played_at"]

            games_played = ChessGame.objects.filter(Q(white_player=user) | Q(black_player=user))
            completed_games = games_played.filter(game_status="Ended")
            
            serialized_completed_games = serialize_models_including_fields(completed_games, fields_to_include)
            sorted_completed_games = sort_serialized_models(serialized_completed_games, "played_at", sort_order="descending")

            return Response(sorted_completed_games, status=status.HTTP_200_OK)
        except Exception as e:
            traceback.print_exc()

class FetchGameWinnerView(APIView):
    def post(self, request):
        game_id = request.data.get("game_id")

        try:
            chess_game_model: ChessGame = ChessGame.objects.get(id=game_id)
            game_winner = chess_game_model.game_winner

            if game_winner:
                return Response(chess_game_model.sync_get_player_color(game_winner), status=status.HTTP_200_OK)
            else:
                return Response(None, status=status.HTTP_200_OK)
        except Exception as e:
            traceback.print_exc()