import json

from channels.generic.websocket import WebsocketConsumer

class UserStatusConsumer(WebsocketConsumer):
	def connect(self):
		self.accept()

		self.send(json.dumps({
			"type": "connection_established",
			"message": "Connection established"
		}))