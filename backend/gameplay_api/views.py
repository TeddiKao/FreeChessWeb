from rest_framework.decorators import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from django.db.models import Q

from .models import ChessGame
from .serializers import ChessGameSerializer

from .utils import fen_parser

# Create your views here.
class ParseFENView(APIView):
	permission_classes = [IsAuthenticated]
	def get(self, request, *args, **kwargs):
		raw_fen_string = request.query_params.get("raw_fen_string")
		parsed_fen = fen_parser.parse_fen(raw_fen_string)

		return Response(parsed_fen, status=status.HTTP_200_OK)


class StartChessGameView(generics.CreateAPIView):
	queryset = ChessGame.objects.all()
	serializer_class = ChessGameSerializer
	permission_classes = [IsAuthenticated]

	def perform_create(self, serializer):
		if serializer.is_valid():
			serializer.save()
		else:
			print(serializer.errors)

class GetOngoingGameView(generics.ListAPIView):
	def get_queryset(self):
		white_player_filter = Q(white_player=self.request.user)
		black_player_filter = Q(black_player=self.request.user)
		game_is_ongoing_filter = Q(game_status="Ongoing")

		return ChessGame.objects.filter((white_player_filter | black_player_filter) & game_is_ongoing_filter)

class MakeMoveView(generics.UpdateAPIView):
	def get_queryset(self):
		white_player_filter = Q(white_player=self.request.user)
		black_player_filter = Q(black_player=self.request.user)
		game_is_ongoing_filter = Q(game_status="Ongoing")

		return ChessGame.objects.filter((white_player_filter | black_player_filter) & game_is_ongoing_filter)
		