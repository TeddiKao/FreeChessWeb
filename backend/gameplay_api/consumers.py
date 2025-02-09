import json
import copy

from urllib.parse import parse_qs

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from move_validation_api.utils.move_validation import validate_move, validate_castling
from move_validation_api.utils.general import *

from .models import ChessGame

class GameConsumer(AsyncWebsocketConsumer):
	@database_sync_to_async
	def get_chess_game(self, chess_game_id) -> ChessGame:
		return ChessGame.objects.get(id=chess_game_id)
	
	@database_sync_to_async
	def get_game_attribute(self, chess_game_model: ChessGame, attribute_name: str):
		return getattr(chess_game_model, attribute_name)

	async def check_move_validation(self, move_info):
		game_id = self.game_id
		
		chess_game: ChessGame = await self.get_chess_game(game_id)
		full_parsed_fen: dict = await chess_game.get_full_parsed_fen()


		if validate_move(full_parsed_fen, move_info):
			return True
		else:
			return False
		
	@database_sync_to_async
	def save_chess_game_model(self, chess_game_model: ChessGame):
		chess_game_model.save()

	async def modify_castling_rights(self, chess_game_model: ChessGame, castling_side: str, color: str, new_value: bool = False):
		new_castling_rights = copy.deepcopy(chess_game_model.castling_rights)

		new_castling_rights[color.capitalize()][castling_side.capitalize()] = new_value
		chess_game_model.castling_rights = new_castling_rights
		
		await self.save_chess_game_model(chess_game_model)

	async def handle_castling(self, chess_game_model: ChessGame, move_info: dict, original_board_placement: dict):
		new_board_placement = copy.deepcopy(original_board_placement)
		
		destination_square = move_info["destination_square"]
		initial_square = move_info["initial_square"] if "initial_square" in move_info.keys() else None
		piece_color: str = move_info["piece_color"]

		# Piece type is not decalared as it will always be a king

		kingside_castling_squares = [6, 62]
		queenside_castling_squares = [2, 58]

		if int(destination_square) in queenside_castling_squares:
			original_queenside_rook_square = str(int(destination_square) - 2)
			castled_queenside_rook_square = str(int(destination_square) + 1)

			new_board_placement[castled_queenside_rook_square] = {
				"piece_type": "Rook",
				"piece_color": piece_color,
				"starting_square": original_queenside_rook_square,
			}

			del new_board_placement[original_queenside_rook_square]

		elif int(destination_square) in kingside_castling_squares:
			original_kingside_roook_square = str(int(destination_square) + 1)
			castled_kingside_rook_square = str(int(destination_square) - 1)

			new_board_placement[castled_kingside_rook_square] = {
				"piece_type": "Rook",
				"piece_color": piece_color,
				"starting_square": original_queenside_rook_square
			}

			del new_board_placement[original_kingside_roook_square]

		return new_board_placement
	
	async def handle_pawn_promotion(self, move_info: dict, original_board_placement: dict):
		destination_square = move_info["destination_square"]
		initial_square = move_info["initial_square"] if "initial_square" in move_info.keys() else None
		piece_color: str = move_info["piece_color"]
		additional_info: dict = move_info["additional_info"]

		new_board_placement = copy.deepcopy(original_board_placement)

		promoted_piece = additional_info["promoted_piece"]

		new_board_placement[str(destination_square)] = {
			"piece_type": promoted_piece,
			"piece_color": piece_color,
			"starting_square": initial_square
		}
			
		return new_board_placement

	async def update_position(self, chess_game_model: ChessGame, move_info: dict):
		new_board_placement = copy.deepcopy(chess_game_model.parsed_board_placement)

		starting_square = move_info["starting_square"]
		destination_square = move_info["destination_square"]
		initial_square = move_info["initial_square"] if "initial_square" in move_info.keys() else None
		piece_color: str = move_info["piece_color"]
		piece_type: str = move_info["piece_type"]
		additonal_info: dict = move_info["additional_info"]

		del new_board_placement[str(starting_square)]

		file_diff = abs(get_file(starting_square) - get_file(destination_square))

		if piece_type.lower() == "king":
			if file_diff == 2:
				new_board_placement = await self.handle_castling(chess_game_model, move_info, new_board_placement)

		elif piece_type.lower() == "rook":
			kingside_rook_starting_squares = [7, 63]
			queenside_rook_starting_squares = [0, 56]
			
			castling_side = "Kingside" if int(initial_square) in kingside_rook_starting_squares else "Queenside"

			await self.modify_castling_rights(chess_game_model, castling_side, piece_color)
			
		elif piece_type.lower() == "pawn":
			if "promoted_piece" in additonal_info.keys():
				new_board_placement = await self.handle_pawn_promotion(move_info, new_board_placement)

		if not "promoted_piece" in additonal_info.keys():
			new_board_placement[str(destination_square)] = {
				"piece_type": piece_type,
				"piece_color": piece_color,
				"starting_square": initial_square
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
		
		await self.send(json.dumps({
			"type": "game_started",
			"user": self.scope["user"].username,
			"game_id": int(game_id),
		}))

	async def disconnect(self, code):
		pass

	async def receive(self, text_data):
		await self.channel_layer.group_send(
			self.room_group_name,
			{
				"type": "move_received",
				"move_data": text_data,
				"move_made_by": self.scope["user"].username
			}
		)

	async def move_received(self, event):
		move_is_valid: bool = await self.check_move_validation(json.loads(event["move_data"]))
		chess_game_model: ChessGame = await self.get_chess_game(self.game_id)
		
		parsed_move_data: dict = json.loads(event["move_data"])

		if move_is_valid:
			await self.update_position(chess_game_model, parsed_move_data)

		await self.send(json.dumps({
			"type": "move_made",
			"move_data": parsed_move_data,
			"move_made_by": event["move_made_by"],
			"move_is_valid": move_is_valid,
			"new_parsed_fen": await chess_game_model.get_full_parsed_fen()
		}))