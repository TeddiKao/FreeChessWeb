import json

from channels.generic.websocket import AsyncWebsocketConsumer

class GameConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		await self.send(json.dumps({
			"type": "game_started",
			"user": self.scope["user"]
		}))

		await self.accept()

	async def disconnect(self, code):
		pass

	async def message():
		pass