from rest_framework.views import APIView
from rest_framework.response import Response

from .utils.position_update import update_structured_fen

class ProcessMoveView(APIView):
    def post(self, request):
        move_info = request.data.get("move_info")
        structured_fen = move_info.get("structured_fen")

        updated_structured_fen = update_structured_fen(structured_fen, move_info)

        return Response(updated_structured_fen)
