from rest_framework.decorators import APIView
from rest_framework.response import Response
from rest_framework import status

from .utils import fen_parser

# Create your views here.
class ParseFENView(APIView):
	def get(self, request, *args, **kwargs):
		parsed_fen = fen_parser.parse_fen(request)

		return Response(parsed_fen, status=status.HTTP_200_OK)

