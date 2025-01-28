import json

from channels.generic.websocket import AsyncWebsocketConsumer

class MatchmakingConsumer(AsyncWebsocketConsumer):
	def connect(self):
		self.accept()

		self.send(json.dumps({
			"type": "connection_established",
			"message": "Connection established"
		}))