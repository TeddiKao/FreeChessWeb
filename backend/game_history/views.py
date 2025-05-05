from django.shortcuts import render
from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from gameplay.models import ChessGame
from core.utils import serialize_models_including_fields

# Create your views here.
class FetchCompletedGamesView(APIView):
    def post(self, request):
        user = request.user
        fields_to_include = ["white_player", "black_player", "game_winner"]

        games_played = ChessGame.objects.filter(Q(white_player=user) | Q(black_player=user))
        completed_games = games_played.filter(game_status="Ended")
        serialized_completed_games = serialize_models_including_fields(completed_games, fields_to_include)

        return Response({
            "completed_games": serialized_completed_games,
            "user_requested": user.username
        }, status=status.HTTP_200_OK)
        