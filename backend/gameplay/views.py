from rest_framework.decorators import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from django.db.models import Q

from .models import ChessGame
from .models import UserGameplaySettings

from .serializers import ChessGameSerializer
from core.utils import serialize_excluding_fields

from .utils import fen_parser

# Create your views here.
class ParseFENView(APIView):
	permission_classes = [IsAuthenticated]
	def get(self, request, *args, **kwargs):
		raw_fen_string = request.query_params.get("raw_fen_string")
		parsed_fen = fen_parser.parse_fen(raw_fen_string)

		return Response(parsed_fen, status=status.HTTP_200_OK)


class GetGameplaySettingsView(APIView):
	permission_classes = [IsAuthenticated]
	
	def post(self, request):
		user = self.request.user
		user_gameplay_settings, created = UserGameplaySettings.objects.get_or_create(user=user)

		return Response({
			"auto_queen": user_gameplay_settings.auto_queen,
			"show_legal_moves": user_gameplay_settings.show_legal_moves
		}, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
	
class UpdateSettingsView(APIView):
	permission_classes = [IsAuthenticated]
	
	def post(self, request):
		user = self.request.user
		setting_to_update = request.data.get("setting_to_update")
		updated_value = request.data.get("updated_value")

		user_gameplay_settings: UserGameplaySettings = UserGameplaySettings.objects.get(user=user)
		setattr(user_gameplay_settings, setting_to_update, updated_value)

		user_gameplay_settings.save()

		serialized_settings = serialize_excluding_fields(user_gameplay_settings, ["id", "user"])

		return Response(serialized_settings, status=status.HTTP_200_OK)

class GetCurrentPositionView(APIView):
	permission_classes = [IsAuthenticated]
	def post(self, request):
		game_id = request.data.get("game_id")
		chess_game_model: ChessGame = ChessGame.objects.get(id=game_id)

		full_parsed_fen = chess_game_model.sync_get_full_parsed_fen()
		return Response(full_parsed_fen, status=status.HTTP_200_OK)

class GetPlayerTimerView(APIView):
	def post(self, request):
		game_id = request.data.get("game_id")
		player_color = request.data.get("player_color")

		chess_game_model: ChessGame = ChessGame.objects.get(id=game_id)
		player_timer_attr = f"{player_color}_player_clock"
		player_timer = getattr(chess_game_model, player_timer_attr)

		return Response(player_timer, status=status.HTTP_200_OK)
	
class GetPositionListView(APIView):
	def post(self, request):
		game_id = request.data.get("game_id")
		chess_game_model: ChessGame = ChessGame.objects.get(id=game_id)
		position_list = chess_game_model.sync_get_position_list()

		return Response(position_list, status=status.HTTP_200_OK)
	
class GetMoveListView(APIView):
	def post(self, request):
		game_id = request.data.get("game_id")
		chess_game_model: ChessGame = ChessGame.objects.get(id=game_id)
		move_list = chess_game_model.sync_get_move_list()

		return Response(move_list, status=status.HTTP_200_OK)