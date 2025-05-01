from channels.generic.websocket import AsyncWebsocketConsumer

class BotGameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        return await super().connect()