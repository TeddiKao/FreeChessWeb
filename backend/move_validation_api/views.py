from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status 

from rest_framework.permissions import IsAuthenticated

from .utils.get_legal_moves import get_legal_moves
from .utils.move_validation import validate_move
from .utils.game_results import get_is_checkmated, get_is_stalemated

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
		
		is_move_valid = not not validate_move(parsed_fen_string, move_info)
		
		if is_move_valid:
			return Response({"is_valid": True}, status=status.HTTP_200_OK)
		else:
			return Response({"is_valid": False}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)


class GetIsCheckmatedView(APIView):
	def post(self, request):
		board_placement = request.data.get("board_placement")
		castling_rights = self.request.data.get("castling_rights")
		king_color = self.request.data.get("king_color")

		is_checkmated = get_is_checkmated(board_placement, castling_rights, king_color)
		return Response(is_checkmated, status=status.HTTP_200_OK)
	
class GetIsStalematedView(APIView):
	def post(self, request):
		board_placement = request.data.get("board_placement")
		castling_rights = self.request.data.get("castling_rights")
		king_color = self.request.data.get("king_color")

		is_stalemated = get_is_stalemated(board_placement, castling_rights, king_color)
		return Response(is_stalemated, status=status.HTTP_200_OK)