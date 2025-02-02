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

		self.room_group_name = f"game_{game_id}"

		await self.channel_layer.group_add(
			self.room_group_name,
			self.channel_name
		)

		await self.send(json.dumps({
			"type": "game_started",
			"user": self.scope["user"].username,
			"game_id": int(game_id),
		}))

	async def disconnect(self, code):
		pass

	async def receive(self, text_data):
		print(text_data)

		await self.channel_layer.group_send(
			self.room_group_name,
			{
				"type": "move_received",
				"move_data": text_data,
				"move_made_by": self.scope["user"].username
			}
		)

		print("Handled!")

	async def move_received(self, event):
		print("Move received!")

		await self.send(json.dumps({
			"type": "move_made",
			"move_data": json.loads(event["move_data"]),
			"move_made_by": event["move_made_by"]
		}))