from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .utils.position_update import update_structured_fen

class ProcessMoveView(APIView):
    def post(self, request):
        move_info = request.data.get("move_info")
        structured_fen = request.data.get("structured_fen")

        updated_structured_fen = update_structured_fen(structured_fen, move_info)

        return Response(updated_structured_fen, status=status.HTTP_200_OK)
