import json

from channels.generic.websocket import AsyncWebsocketConsumer

class MatchmakingConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		user = self.scope["user"]

		

		await self.accept()

		

		await self.send(json.dumps({
			"type": "connection_established",
			"message": "Connection established",
			"user": getattr(user, "email")
		}))

		

	async def disconnect(self, code):
		pass