import json

from channels.generic.websocket import AsyncWebsocketConsumer

class MatchmakingConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		await self.accept()

		await self.send(json.dumps({
			"type": "connection_established",
			"message": "Connection established"
		}))