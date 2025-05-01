from channels.generic.websocket import AsyncWebsocketConsumer

class BotGameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        query_string: bytes = self.scope.get("query_string", b"")
        decoded_query_string = query_string.decode()

        game_id = decoded_query_string.get("gameId")[0]

        await self.accept()