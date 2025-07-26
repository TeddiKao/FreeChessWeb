from time import perf_counter

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status 

from rest_framework.permissions import IsAuthenticated

from .utils.get_legal_moves import get_legal_moves
from .utils.move_validation import validate_move
from .utils.get_move_type import get_move_type
from .utils.result_detection import get_is_checkmated, get_is_stalemated

class ShowLegalMoveView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request):
		current_fen = request.data.get("parsed_fen_string")
		move_info = request.data.get("move_info")

		legal_moves = get_legal_moves(move_info, current_fen["board_placement"], current_fen["en_passant_target_square"], current_fen["castling_rights"])

		return Response(legal_moves, status=status.HTTP_200_OK)

class ValidateMoveView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request):
		move_info = request.data.get("move_info")
		
		# The user must send a parsed FEN string and not the raw FEN string
		parsed_fen_string = request.data.get("parsed_fen_string")

		board_placement = parsed_fen_string["board_placement"]
		en_passant_target_square = parsed_fen_string["en_passant_target_square"]

		is_move_valid = not not validate_move(parsed_fen_string, move_info)

		if is_move_valid:
			move_type = get_move_type(board_placement, en_passant_target_square, move_info)

			return Response({
				"is_valid": True,
				"move_type": move_type,
			}, status=status.HTTP_200_OK)
		else:
			return Response({"is_valid": False}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)