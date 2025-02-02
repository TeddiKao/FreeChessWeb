import json

from channels.generic.websocket import AsyncWebsocketConsumer

class GameConsumer(AsyncWebsocketConsumer):
	async def update_position(self, new_position):
		pass
	async def connect(self):
		await self.accept()

		await self.send(json.dumps({
			"type": "game_started",
			"user": self.scope["user"].username
		}))

	async def disconnect(self, code):
		pass

	async def receive(self, text_data):
		await self.send(json.dumps({
			"type": "received_move",
			"move_data": json.loads(text_data),
			"sent_by": self.scope["user"].username
		}))