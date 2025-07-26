
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .utils.result_detection import get_is_checkmated, get_is_stalemated

# Create your views here.
class GetIsCheckmatedView(APIView):
	def post(self, request):
		structured_fen = request.data.get("structured_fen")
		king_color = request.data.get("king_color")

		is_checkmated = get_is_checkmated(structured_fen, king_color)
		return Response(is_checkmated, status=status.HTTP_200_OK)
	
class GetIsStalematedView(APIView):
	def post(self, request):
		structured_fen = request.data.get("structured_fen")
		king_color = request.data.get("king_color")

		is_stalemated = get_is_stalemated(structured_fen, king_color)
		return Response(is_stalemated, status=status.HTTP_200_OK)