import random

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import WaitingPlayer
from gameplay_api.models import ChessGame

class CancelMatchingView(APIView):
	def post(self, request):
		player = request.user

		try:
			player_in_queue = WaitingPlayer.objects.get(user=player)
		except WaitingPlayer.DoesNotExist:
			response_data = {
				"result": "Failed to cancel"
			}

			return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
		
		player_in_queue.delete()
		response_data = {
			"result": "Cancelled successfully"
		}

		return Response(response_data, status=status.HTTP_200_OK)

class MatchmakingView(APIView):
	def post(self, request):
		player = request.user
		waiting_player = WaitingPlayer.objects.first()
		
		try:
			player_in_queue = WaitingPlayer.objects.get(user=player)
		except WaitingPlayer.DoesNotExist:
			player_in_queue = None

		if player_in_queue:
			waiting_player = WaitingPlayer.objects.exclude(user=player).first()

			if not waiting_player:
				response_data = {
					"matchmaking_status": "Waiting",
					"player_found": None
				}

				return Response(response_data, status=status.HTTP_202_ACCEPTED)

		if waiting_player:
			print("Match found!")

			opponent = waiting_player.user
			waiting_player.delete()

			if player_in_queue:
				player_in_queue.delete()

			if random.choice([True, False]):
				white_player = player
				black_player = opponent
			else:
				white_player = opponent
				black_player = player

			ChessGame.objects.create(white_player=white_player, black_player=black_player, white_player_clock=180, black_player_clock=180)

			response_data = {
				"matchmaking_status": "Found player",
				"player_found": opponent.username
			}

			return Response(response_data, status=status.HTTP_200_OK)
		else:
			response_data = {
				"matchmaking_status": "Waiting",
				"player_found": None
			}

			WaitingPlayer.objects.create(user=request.user)
			return Response(response_data, status=status.HTTP_202_ACCEPTED)

