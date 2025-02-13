from rest_framework.decorators import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from django.db.models import Q

from .models import ChessGame
from .models import UserGameplaySettings

from .serializers import ChessGameSerializer
from .serializers import GameplaySettingsSerializer

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
		
class GetGameplaySettingsView(APIView):
	def post(self, request):
		user = self.request.user
		user_gameplay_settings, created = UserGameplaySettings.objects.get_or_create(user=user)

		return Response({
			"auto_queen": user_gameplay_settings.auto_queen,
			"show_legal_moves": user_gameplay_settings.show_legal_moves
		}, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
	
class UpdateSettingsView(APIView):
	def post(self, request):
		user = self.request.user
		setting_to_update = request.data.get("setting_to_update")
		updated_value = request.data.get("updated_value")

		user_gameplay_settings: UserGameplaySettings = UserGameplaySettings.objects.get(user=user)
		user_gameplay_settings[setting_to_update] = updated_value
		user_gameplay_settings.save()