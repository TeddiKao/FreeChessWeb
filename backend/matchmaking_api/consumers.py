import json

from channels.generic.websocket import AsyncWebsocketConsumer

class MatchmakingConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		user = self.scope["user"]

		print("Connected!")

		await self.accept()

		print("Connection accepted!")

		await self.send(json.dumps({
			"type": "connection_established",
			"message": "Connection established",
			"user": getattr(user, "email")
		}))

		print("Sent message!")

	async def disconnect(self, code):
		print("Disconnected!")