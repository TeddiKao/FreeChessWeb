from rest_framework.decorators import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from django.db.models import Q

from .models import ChessGame
from .serializers import ChessGameSerializer
from .utils import fen_parser, move_validation, show_legal_moves, get_king_is_in_check

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

		legal_moves = show_legal_moves.get_legal_moves(move_info, current_fen)
		print(f"Legal moves: {legal_moves}")

		return Response(legal_moves, status=status.HTTP_200_OK)

class ValidateMoveView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request):
		move_info = request.data.get("move_info")
		print(f"Sent move info {move_info}" )
		# The user must send a parsed FEN string and not the raw FEN string
		parsed_fen_string = request.data.get("parsed_fen_string")
		is_move_valid = not not move_validation.validate_move(parsed_fen_string, move_info)
		
		if is_move_valid:
			return Response({"is_valid": True}, status=status.HTTP_200_OK)
		else:
			return Response({"is_valid": False}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

class GetIsKingInCheckView(APIView):
	def post(self, request):
		board_placement = request.data.get("board_placement")
		king_color = request.data.get("king_color")
		king_square = request.data.get("king_square")

		is_king_in_check = get_king_is_in_check.is_king_in_check(board_placement, king_color, king_square)
		
		return Response(is_king_in_check, status=status.HTTP_200_OK)

class StartChessGameView(generics.CreateAPIView):
	queryset = ChessGame.objects.all()
	serializer_class = ChessGameSerializer
	permission_classes = [IsAuthenticated]

	def perform_create(self, serializer):
		if serializer.is_valid():
			serializer.save()
		else:
			print(serializer.errors)

class UpdateChessGameView(generics.UpdateAPIView):
	def get_queryset(self):
		white_player_filter = Q(white_player=self.request.user)
		black_player_filter = Q(black_player=self.request.user)
		game_is_ongoing_filter = Q(game_status="Ongoing")

		return ChessGame.objects.filter((white_player_filter | black_player_filter) & game_is_ongoing_filter)
	
	serializer_class = ChessGameSerializer
	permission_classes = [IsAuthenticated]