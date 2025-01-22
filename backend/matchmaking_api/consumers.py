from channels.generic.websocket import WebsocketConsumer

class QueueManager(WebsocketConsumer):
	def receive(self, text_data=None, bytes_data=None):
		print(text_data)