from rest_framework.decorators import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from django.db.models import Q

from .models import ChessGame
from .serializers import ChessGameSerializer
from .utils import fen_parser, move_validation
from .utils.get_legal_moves import get_legal_moves
from .utils import game_results

# Create your views here.
class ParseFENView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request, *args, **kwargs):
		raw_fen_string = request.query_params.get("raw_fen_string")
		parsed_fen = fen_parser.parse_fen(raw_fen_string)

		return Response(parsed_fen, status=status.HTTP_200_OK)

class ShowLegalMoveView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request):
		current_fen = request.data.get("parsed_fen_string")
		move_info = request.data.get("move_info")

		legal_moves = get_legal_moves(move_info, current_fen["board_placement"], current_fen["castling_rights"])
		

		return Response(legal_moves, status=status.HTTP_200_OK)

class ValidateMoveView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request):
		move_info = request.data.get("move_info")
		
		# The user must send a parsed FEN string and not the raw FEN string
		parsed_fen_string = request.data.get("parsed_fen_string")
		
		is_move_valid = not not move_validation.validate_move(parsed_fen_string, move_info)
		
		if is_move_valid:
			return Response({"is_valid": True}, status=status.HTTP_200_OK)
		else:
			return Response({"is_valid": False}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

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

class UpdateChessGameView(generics.UpdateAPIView):
	def get_queryset(self):
		white_player_filter = Q(white_player=self.request.user)
		black_player_filter = Q(black_player=self.request.user)
		game_is_ongoing_filter = Q(game_status="Ongoing")

		return ChessGame.objects.filter((white_player_filter | black_player_filter) & game_is_ongoing_filter)
	
	serializer_class = ChessGameSerializer
	permission_classes = [IsAuthenticated]

class GetIsCheckmatedView(APIView):
	def post(self, request):
		board_placement = request.data.get("board_placement")
		castling_rights = self.request.data.get("castling_rights")
		king_color = self.request.data.get("king_color")

		is_checkmated = game_results.is_checkmated(board_placement, castling_rights, king_color)
		return Response(is_checkmated, status=status.HTTP_200_OK)
	
class GetIsStalematedView(APIView):
	def post(self, request):
		board_placement = request.data.get("board_placement")
		castling_rights = self.request.data.get("castling_rights")
		king_color = self.request.data.get("king_color")

		is_stalemated = game_results.is_stalemated(board_placement, castling_rights, king_color)
		return Response(is_stalemated, status=status.HTTP_200_OK)