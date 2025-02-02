import json

from urllib.parse import parse_qs

from channels.generic.websocket import AsyncWebsocketConsumer

class GameConsumer(AsyncWebsocketConsumer):
	async def update_position(self, new_position):
		pass
	async def connect(self):
		query_string: bytes = self.scope.get("query_string", b"")
		decoded_query_string = query_string.decode()

		game_id = parse_qs(decoded_query_string)["gameId"][0]

		await self.accept()

		self.room_group_name = None

		await self.send(json.dumps({
			"type": "game_started",
			"user": self.scope["user"].username,
			"game_id": int(game_id),
		}))

	async def disconnect(self, code):
		pass

	async def receive(self, text_data):
		await self.send(json.dumps({
			"type": "received_move",
			"move_data": json.loads(text_data),
			"sent_by": self.scope["user"].username
		}))