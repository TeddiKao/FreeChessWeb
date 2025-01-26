import random

from django.shortcuts import render
from rest_framework.views import APIView
from .models import WaitingPlayer
from gameplay_api.models import ChessGame

class MatchmakingView(APIView):
	def post(self, request):
		player = request.user
		waiting_player = WaitingPlayer.objects.first()

		if waiting_player:
			opponent = waiting_player.user
			waiting_player.delete()

			if random.choice([True, False]):
				white_player = player
				black_player = opponent
			else:
				white_player = opponent
				black_player = player

			ChessGame.objects.create(white_player=white_player, black_player=black_player)
		else:
			WaitingPlayer.objects.create(user=request.user)

