import json
import copy

from urllib.parse import parse_qs

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from move_validation_api.utils.move_validation import validate_move, validate_castling
from .models import ChessGame

class GameConsumer(AsyncWebsocketConsumer):
	@database_sync_to_async
	def get_chess_game(self, chess_game_id) -> ChessGame:
		return ChessGame.objects.get(id=chess_game_id)
	
	@database_sync_to_async
	def get_game_attribute(self, chess_game_model: ChessGame, attribute_name: str):
		return getattr(chess_game_model, attribute_name)

	async def check_move_validation(self, move_info):
		print(move_info)
		game_id = self.game_id
		
		chess_game: ChessGame = await self.get_chess_game(game_id)
		full_parsed_fen: dict = await chess_game.get_full_parsed_fen()

		print("full_parsed_fen", full_parsed_fen)

		if validate_move(full_parsed_fen, move_info):
			return True
		else:
			return False
		
	@database_sync_to_async
	def save_chess_game_model(self, chess_game_model: ChessGame):
		chess_game_model.save()

	async def update_position(self, chess_game_model: ChessGame, move_info):
		new_board_placement = copy.deepcopy(chess_game_model.parsed_board_placement)
		
		starting_square = move_info["starting_square"]
		destination_square = move_info["destination_square"]
		piece_color: str = move_info["piece_color"]
		piece_type: str = move_info["piece_type"]

		del new_board_placement[f"{starting_square}"]
		new_board_placement[f"{destination_square}"] = {
            "piece_type": piece_type,
            "piece_color": piece_color
        }

		chess_game_model.parsed_board_placement = new_board_placement
		await self.save_chess_game_model(chess_game_model)

	async def connect(self):
		query_string: bytes = self.scope.get("query_string", b"")
		decoded_query_string = query_string.decode()

		game_id = parse_qs(decoded_query_string)["gameId"][0]

		await self.accept()

		self.room_group_name = f"game_{game_id}"
		self.game_id = game_id

		await self.channel_layer.group_add(
			self.room_group_name,
			self.channel_name
		)

		print("User has connected!")

		await self.send(json.dumps({
			"type": "game_started",
			"user": self.scope["user"].username,
			"game_id": int(game_id),
		}))

	async def disconnect(self, code):
		pass

	async def receive(self, text_data):
		print("Received message")
		print(text_data)

		await self.channel_layer.group_send(
			self.room_group_name,
			{
				"type": "move_received",
				"move_data": text_data,
				"move_made_by": self.scope["user"].username
			}
		)

	async def move_received(self, event):
		print(json.loads(event["move_data"]))
		move_is_valid: bool = await self.check_move_validation(json.loads(event["move_data"]))
		print(move_is_valid)
		
		chess_game_model: ChessGame = await self.get_chess_game(self.game_id)
		
		parsed_move_data = json.loads(event["move_data"])

		if move_is_valid:
			await self.update_position(chess_game_model, parsed_move_data)

		print("New board placement", chess_game_model.parsed_board_placement)

		await self.send(json.dumps({
			"type": "move_made",
			"move_data": parsed_move_data,
			"move_made_by": event["move_made_by"],
			"move_is_valid": move_is_valid,
			"new_parsed_fen": await chess_game_model.get_full_parsed_fen()
		}))