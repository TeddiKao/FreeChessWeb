from rest_framework.decorators import APIView
from rest_framework.response import Response
from rest_framework import status

from .utils import fen_parser

# Create your views here.
class ParseFENView(APIView):
	def get(self, request, *args, **kwargs):
		raw_fen_string = request.query_params.get("raw_fen_string")
		parsed_fen = fen_parser.parse_fen(raw_fen_string)

		return Response(parsed_fen, status=status.HTTP_200_OK)

