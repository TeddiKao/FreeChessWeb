import json
import time
import random

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from .models import WaitingPlayer

class MatchmakingConsumer(AsyncWebsocketConsumer):
	async def decide_player_color(self):
		if random.choice([True, False]):
			return "white", "black"
		else:
			return "black", "white"
		
	@database_sync_to_async
	def remove_player_from_queue(self, player_object):
		player_object.delete()
		
	@database_sync_to_async
	def get_player_in_queue(self, player):
		try:
			player_in_queue = WaitingPlayer.objects.get(user=player)
		except WaitingPlayer.DoesNotExist:
			player_in_queue = None

		return player_in_queue
	
	@database_sync_to_async
	def create_waiting_player(self, user_model):
		WaitingPlayer.objects.create(user=user_model)

	@database_sync_to_async
	def set_matched_player(self, player_to_set, matched_player):
		player_to_set.matched_user = matched_player
		player_to_set.save()

	@database_sync_to_async
	def is_player_matched(self, player_to_check):
		return getattr(player_to_check, "matched_user")

	@database_sync_to_async
	def get_first_matching_player(self):
		return WaitingPlayer.objects.exclude(user=self.scope["user"]).first()
		
	@database_sync_to_async
	def get_matched_user(self, user_to_check):
		try:
			return WaitingPlayer.objects.get(matched_user=user_to_check)
		except WaitingPlayer.DoesNotExist:
			return None
		
	@database_sync_to_async
	def get_user_model_from_waiting_player(self, waiting_player: WaitingPlayer):
		return waiting_player.user
			
	async def match_player(self):
		player_to_match = self.scope["user"]
		match_found = False

		print(player_to_match)
		
		while not match_found:
			print("Looking for match")
			print(self.scope["user"])
			player_in_queue = await self.get_player_in_queue(player_to_match)
			matched_user = await self.get_matched_user(player_to_match)

			if matched_user:
				print(f"A player has been found for {player_to_match}")

				matched_player_color, player_to_match_color = await self.decide_player_color() 

				white_player = await self.get_user_model_from_waiting_player(matched_user) if matched_player_color == "white" else player_to_match
				black_player = await self.get_user_model_from_waiting_player(matched_user) if matched_player_color == "black" else player_to_match

				print(type(white_player), type(black_player))

				await self.channel_layer.group_send(
					self.room_group_name,
					{
						"type": "player_matched",
						"match_found": True,
						"white_player": white_player.username,
						"black_player": black_player.username
					}
				)
				await self.remove_player_from_queue(matched_user)

				match_found = True

				break

			if not player_in_queue:
				matched_player = await self.get_first_matching_player()

				await self.create_waiting_player(player_to_match)

				if matched_player:
					print(await matched_player.get_username())

					waiting_player_to_match = await self.get_player_in_queue(player_to_match)

					await self.set_matched_player(matched_player, player_to_match)
					await self.set_matched_player(waiting_player_to_match, matched_player.user)

					# await self.remove_player_from_queue(matched_player)
					print(f"Removed player {await matched_player.get_username()}")

				else:
					print("Sending")

					await self.send(json.dumps({
						"type": "finding_match",
						"match_found": False,
						"white_player": None,
						"black_player": None
					}))
			else:
				await self.send(json.dumps({
					"type": "finding_match",
					"match_found": False,
					"white_player": None,
					"black_player": None
				}))


			time.sleep(1)


	async def connect(self):
		user = self.scope["user"]

		self.room_group_name = "test"
		await self.channel_layer.group_add(
			self.room_group_name,
			self.channel_name
		)
		
		await self.accept()

		await self.send(json.dumps({
			"type": "connection_established",
			"message": "Connection established",
		}))

		await self.match_player()

	async def disconnect(self, code):
		pass

	async def player_matched(self, event):
		await self.send(json.dumps({
			"type": "match_found",
			"match_found": event["match_found"],
			"white_player": event["white_player"],
			"black_player": event["black_player"]
		}))

		print("Sent message to players")