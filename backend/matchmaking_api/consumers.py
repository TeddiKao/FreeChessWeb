import json
import time
import random

from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync

from .models import WaitingPlayer

class MatchmakingConsumer(AsyncWebsocketConsumer):
	async def decide_player_color(self):
		if random.choice([True, False]):
			return "white", "black"
		else:
			return "black", "white"
		
	async def match_player(self):
		player_to_match = self.scope["user"]
		match_found = False
		
		while not match_found:
			try:
				player_in_queue = WaitingPlayer.objects.get(user=player_to_match)
			except WaitingPlayer.DoesNotExist:
				player_in_queue = None

			if not player_in_queue:
				matched_player = WaitingPlayer.objects.first()
				matched_player_color, player_to_match_color = self.decide_player_color() 

				white_player = matched_player if matched_player_color == "white" else player_to_match
				black_player = matched_player if matched_player_color == "black" else player_to_match

				if matched_player:
					await self.channel_layer.group_send(
						self.room_group_name,
						{
							"type": "player_matched",
							"white_player": white_player,
							"black_player": black_player
						}
					)

					return

			time.sleep(1)


	async def connect(self):
		user = self.scope["user"]

		self.room_group_name = "test"
		async_to_sync(self.channel_layer.group_add)(
			self.room_group_name,
			self.channel_name
		)
		
		await self.accept()

		await self.send(json.dumps({
			"type": "connection_established",
			"message": "Connection established",
			"user": getattr(user, "email")
		}))

	async def disconnect(self, code):
		pass