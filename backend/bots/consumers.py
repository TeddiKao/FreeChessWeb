import json

from urllib.parse import parse_qs

from channels.generic.websocket import AsyncWebsocketConsumer

class BotGameConsumer(AsyncWebsocketConsumer):
    async def handle_player_move_made(self, move_info):
        pass

    async def connect(self):
        query_string: bytes = self.scope.get("query_string", b"")
        decoded_query_string = query_string.decode()
        parsed_query_string = parse_qs(decoded_query_string)

        game_id = parsed_query_string.get("gameId")[0]

        await self.accept()

    async def receive(self, text_data=None, bytes_data=None):
        parsed_text_data = json.loads(text_data)

        match parsed_text_data["type"]:
            case "move_made":
                move_info = parsed_text_data["move_info"]
                await self.handle_player_move_made(move_info)