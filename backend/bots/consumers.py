import json
import asyncio
import logging

from urllib.parse import parse_qs
from channels.generic.websocket import AsyncWebsocketConsumer

from .models import BotGame
from .engines import initialise_stockfish_instance

from gameplay.utils.position_update import update_structured_fen
from gameplay.utils.game_state_history_update import update_move_list, update_position_list
from gameplay.utils.raw_fen_parser import parse_raw_fen
from gameplay.utils.structured_move_parser import parse_structured_move

from move_validation.utils.move_validation import validate_move
from move_validation.utils.get_move_type import get_move_type
from move_validation.utils.result_detection import get_is_checkmated, get_is_stalemated, is_threefold_repetiiton, check_50_move_rule_draw
from move_validation.utils.general import get_opposite_color

logger = logging.getLogger(__name__)

class BotGameConsumer(AsyncWebsocketConsumer):
	async def check_for_results(self, bot_game_model: BotGame, piece_color_moved):
		updated_structured_fen, updated_position_list, updated_halfmove_clock, player_color = await asyncio.gather(
			bot_game_model.async_get_full_structured_fen(),
			bot_game_model.async_get_position_list(),
			bot_game_model.async_get_game_attr("halfmove_clock"),
			bot_game_model.async_get_player_color()
		)

		opposite_color = get_opposite_color(piece_color_moved)
		
		if get_is_checkmated(updated_structured_fen, opposite_color):
			await self.send(json.dumps({
				"type": "checkmate_occurred",
				"winning_color": piece_color_moved,
				"game_winner": "player" if piece_color_moved.lower() == player_color.lower() else "bot"
			}))

		elif get_is_stalemated(updated_structured_fen, opposite_color):
			await self.send(json.dumps({
				"type": "stalemate_occurred",
			}))

		elif is_threefold_repetiiton(updated_position_list, updated_structured_fen):
			await self.send(json.dumps({
				"type": "threefold_repetition_occurred"
			}))

		elif check_50_move_rule_draw(updated_halfmove_clock):
			await self.send(json.dumps({
				"type": "50_move_rule_reached"
			}))

	async def get_updated_game_state(self, bot_game_model: BotGame, move_info: dict):
		current_structured_fen, current_move_list, current_position_list = await asyncio.gather(
			bot_game_model.async_get_full_structured_fen(),
			bot_game_model.async_get_move_list(),
			bot_game_model.async_get_position_list()
		)

		updated_structured_fen = update_structured_fen(current_structured_fen, move_info)
		updated_move_list = update_move_list(current_structured_fen, current_move_list, move_info)
		updated_position_list = update_position_list(current_position_list, move_info, updated_structured_fen)

		await asyncio.gather(
			bot_game_model.async_update_full_structured_fen(updated_structured_fen, should_save=False),
			bot_game_model.async_update_game_attr("move_list", updated_move_list, should_save=False)
		)

		await bot_game_model.async_update_game_attr("position_list", updated_position_list)

		return updated_structured_fen, updated_move_list, updated_position_list

	async def handle_player_move_made(self, move_info):
		
		piece_color = move_info["piece_color"]

		bot_game_model: BotGame = await BotGame.async_get_bot_game_from_id(self.game_id)

		current_structured_fen = await bot_game_model.async_get_full_structured_fen()
		current_board_placement = current_structured_fen["board_placement"]
		current_en_passant_target_square = current_structured_fen["en_passant_target_square"]

		can_player_move = await bot_game_model.async_can_player_move(piece_color)
		if not can_player_move:
			return

		if not validate_move(current_structured_fen, move_info):
			return

		updated_structured_fen, updated_move_list, updated_position_list = await self.get_updated_game_state(bot_game_model, move_info)

		await self.check_for_results(bot_game_model, piece_color)
		await self.send(json.dumps({
			"type": "move_registered",
			"move_data": move_info,
			"new_structured_fen": updated_structured_fen,
			"new_position_list": updated_position_list,
			"new_move_list": updated_move_list,
			"move_type": get_move_type(current_board_placement, current_en_passant_target_square, move_info)
		}))

		return True

	async def connect(self):
		query_string: bytes = self.scope.get("query_string", b"")
		decoded_query_string = query_string.decode()
		parsed_query_string = parse_qs(decoded_query_string)

		game_id = parsed_query_string.get("gameId")[0]

		await self.accept()

		self.game_id = game_id
		self.stockfish_engine = initialise_stockfish_instance()

		bot_game_model: BotGame = await BotGame.async_get_bot_game_from_id(self.game_id)
		current_player_turn = await bot_game_model.async_get_game_attr("current_player_turn")
		
		player_color = await bot_game_model.async_get_player_color()
		if player_color.lower() != current_player_turn.lower():
			await self.make_bot_move()

	async def make_bot_move(self):
		bot_game_model: BotGame = await BotGame.async_get_bot_game_from_id(self.game_id)

		current_structured_fen = await bot_game_model.async_get_full_structured_fen()
		current_board_placement = current_structured_fen["board_placement"]
		current_en_passant_target_square = current_structured_fen["en_passant_target_square"]
		
		raw_fen = parse_raw_fen(current_structured_fen)

		self.stockfish_engine.set_fen_position(raw_fen)
		logger.info(raw_fen)

		best_move = self.stockfish_engine.get_best_move()

		structured_move_info = parse_structured_move(current_board_placement, best_move)

		if not validate_move(current_structured_fen, structured_move_info):
			return

		updated_structured_fen, updated_move_list, updated_position_list = await self.get_updated_game_state(bot_game_model, structured_move_info)

		await asyncio.sleep(0.3)
		await self.check_for_results(bot_game_model, structured_move_info["piece_color"])
		
		await self.send(json.dumps({
			"type": "bot_move_made",
			"move_data": structured_move_info,
			"new_structured_fen": updated_structured_fen,
			"new_position_list": updated_position_list,
			"new_move_list": updated_move_list,
			"move_type": get_move_type(current_board_placement, current_en_passant_target_square, structured_move_info)
		}))

	async def receive(self, text_data=None, bytes_data=None):
		parsed_text_data = json.loads(text_data)

		match parsed_text_data["type"]:
			case "move_made":
				move_info = parsed_text_data["move_info"]

				move_successfully_made = await self.handle_player_move_made(move_info)
				if move_successfully_made:
					await self.make_bot_move()