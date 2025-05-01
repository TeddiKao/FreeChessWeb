import json
import copy

from urllib.parse import parse_qs
from channels.generic.websocket import AsyncWebsocketConsumer

from .models import BotGame

from gameplay.utils.position_update import update_structured_fen
from gameplay.utils.game_state_history_update import update_move_list, update_position_list

from move_validation.utils.move_validation import validate_move
from move_validation.utils.get_move_type import get_move_type

class BotGameConsumer(AsyncWebsocketConsumer):
    async def handle_player_move_made(self, move_info):
        bot_game_model: BotGame = await BotGame.async_get_bot_game_from_id(self.game_id)
        
        current_structured_fen = await bot_game_model.async_get_full_structured_fen()
        current_board_placement = current_structured_fen["board_placement"]
        current_en_passant_target_square = current_structured_fen["en_passant_target_square"]
        
        current_move_list = await bot_game_model.async_get_move_list()
        current_position_list = await bot_game_model.async_get_position_list()

        if not validate_move(current_structured_fen, move_info):
            return

        updated_structured_fen = update_structured_fen(current_structured_fen, move_info)
        updated_move_list = update_move_list(current_structured_fen, current_move_list, move_info)
        updated_position_list = update_position_list(current_position_list, move_info, updated_structured_fen)

        await bot_game_model.async_update_full_structured_fen(updated_structured_fen)
        await bot_game_model.async_update_game_attr("position_list", updated_position_list)
        await bot_game_model.async_update_game_attr("move_list", updated_move_list)

        await self.send(json.dumps({
            "type": "move_registered",
            "new_structured_fen": updated_structured_fen,
            "new_position_list": updated_position_list,
            "new_move_list": updated_move_list,
            "move_type": get_move_type(current_board_placement, current_en_passant_target_square, move_info)
        }))

    async def connect(self):
        print("Connected!")

        query_string: bytes = self.scope.get("query_string", b"")
        decoded_query_string = query_string.decode()
        parsed_query_string = parse_qs(decoded_query_string)

        game_id = parsed_query_string.get("gameId")[0]

        await self.accept()

        self.game_id = game_id

    async def receive(self, text_data=None, bytes_data=None):
        parsed_text_data = json.loads(text_data)

        match parsed_text_data["type"]:
            case "move_made":
                move_info = parsed_text_data["move_info"]
                await self.handle_player_move_made(move_info)