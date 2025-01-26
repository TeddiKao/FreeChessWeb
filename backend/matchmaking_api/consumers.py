from channels.generic.websocket import AsyncJsonWebsocketConsumer

class MatchmakingConsumer(AsyncJsonWebsocketConsumer):
	async def connect(self):
		print(self.scope)

	async def disconnect(self, code):
		return await super().disconnect(code)

	async def receive(self, text_data=None, bytes_data=None, **kwargs):
		return await super().receive(text_data, bytes_data, **kwargs)