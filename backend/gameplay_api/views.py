from rest_framework.decorators import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status

from rest_framework.permissions import IsAuthenticated, AllowAny

from .utils import fen_parser, move_validation

# Create your views here.
class ParseFENView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request, *args, **kwargs):
		raw_fen_string = request.query_params.get("raw_fen_string")
		parsed_fen = fen_parser.parse_fen(raw_fen_string)

		return Response(parsed_fen, status=status.HTTP_200_OK)


class ValidateMoveView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request, *args, **kwargs):
		move_info = request.query_params.get("move_info")

		# The user must send a parsed FEN string and not the raw FEN string
		parsed_fen_string = request.query_params.get("parsed_fen_string")
		is_move_valid = not not move_validation.validate_move(parsed_fen_string, move_info)
		
		if is_move_valid:
			return Response({"is_valid": True}, status=status.HTTP_200_OK)
		else:
			return Response({"is_valid": False}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)


class StartChessGameView(generics.CreateAPIView):
	permission_classes = [IsAuthenticated]

	def perform_create(self, serializer):
		if serializer.is_valid():
			serializer.save()
		else:
			print(serializer.errors)