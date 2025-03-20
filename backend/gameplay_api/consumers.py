import json
import copy
import asyncio

from decimal import Decimal
from asyncio import Lock
from time import perf_counter

from urllib.parse import parse_qs

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from move_validation_api.utils.move_validation import validate_move, validate_castling
from move_validation_api.utils.get_move_type import get_move_type
from move_validation_api.utils.general import *
from move_validation_api.utils.result_detection import get_is_checkmated, get_is_stalemated

from .models import ChessGame
from .utils.algebraic_notation_parser import get_algebraic_notation

timer_tasks_info = {}


def calculate_position_index(piece_color: str, move_number: int):
    if piece_color.lower() == "white":
        return (move_number - 1) * 2 + 1
    else:
        return (move_number - 1) * 2 + 2


class GameConsumer(AsyncWebsocketConsumer):
	@database_sync_to_async
	def get_chess_game(self, chess_game_id) -> ChessGame:
		return ChessGame.objects.get(id=chess_game_id)

	@database_sync_to_async
	def get_game_attribute(self, chess_game_model: ChessGame, attribute_name: str):
		return getattr(chess_game_model, attribute_name)

	@database_sync_to_async
	def update_game_attribute(self, chess_game_model: ChessGame, attribute: str, new_value):
		setattr(chess_game_model, attribute, new_value)
		chess_game_model.save()

	async def decrement_white_player_timer(self, chess_game_model: ChessGame, decrement_amount: float | int):
		current_time = await self.get_game_attribute(chess_game_model, "white_player_clock")
		new_time = current_time - Decimal(decrement_amount)

		await self.update_game_attribute(chess_game_model, "white_player_clock", new_time)

	async def increment_white_player_timer(self, chess_game_model: ChessGame, increment_amount: float | int):
		if (increment_amount < 0):
			return

		current_time = await self.get_game_attribute(chess_game_model, "white_player_clock")

		new_time = current_time + Decimal(increment_amount)
		await self.update_game_attribute(chess_game_model, "white_player_clock", new_time)
		await self.save_chess_game_model(chess_game_model)

	async def increment_black_player_timer(self, chess_game_model: ChessGame, increment_amount: float | int):
		if (increment_amount < 0):
			return

		current_time = await self.get_game_attribute(chess_game_model, "black_player_clock")
		new_time = current_time + Decimal(increment_amount)

		await self.update_game_attribute(chess_game_model, "black_player_clock", new_time)
		await self.save_chess_game_model(chess_game_model)

	async def decrement_black_player_timer(self, chess_game_model: ChessGame, decrement_amount: float | int):
		current_time = await self.get_game_attribute(chess_game_model, "black_player_clock")
		new_time = current_time - Decimal(decrement_amount)

		await self.update_game_attribute(chess_game_model, "black_player_clock", new_time)

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

	async def end_game(self, chess_game_model: ChessGame, game_result: str):
		await self.update_game_attribute(chess_game_model, "game_status", "Ended")
		await self.update_game_attribute(chess_game_model, "game_result", game_result)

	async def handle_timer_decrement(self):
		chess_game = await self.get_chess_game(self.game_id)

		while await self.get_game_attribute(chess_game, "game_status") == "Ongoing":
			async with self.timer_lock:
				chess_game = await self.get_chess_game(self.game_id)
				
				white_player_clock = await self.get_game_attribute(chess_game, "white_player_clock")
				black_player_clock = await self.get_game_attribute(chess_game, "black_player_clock")

				side_to_move = await self.get_game_attribute(chess_game, "current_player_turn")

				print(white_player_clock, black_player_clock)

				if white_player_clock > 0 and black_player_clock > 0:
					if side_to_move.lower() == "white":
						await self.decrement_white_player_timer(chess_game, 1)
					elif side_to_move.lower() == "black":
						await self.decrement_black_player_timer(chess_game, 1)

				if self.channel_name:
					await self.channel_layer.group_send(
						self.room_group_name,
						{
							"type": "timer_decremented",
							"white_player_clock": white_player_clock,
							"black_player_clock": black_player_clock,
							"side_to_move": side_to_move.lower(),
						}
					)

				if white_player_clock <= 0:
					await self.handle_player_timeout(chess_game, "white")
					break
				elif black_player_clock <= 0:
					await self.handle_player_timeout(chess_game, "black")
					break

			await asyncio.sleep(1)

	async def append_to_position_list(self, chess_game_model: ChessGame, move_info: dict):
		newest_updated_fen = await chess_game_model.get_full_parsed_fen()
		current_position_list = await self.get_game_attribute(chess_game_model, "position_list")

		starting_square = move_info["starting_square"]
		destination_square = move_info["destination_square"]

		updated_position_list: list = copy.deepcopy(current_position_list)
		updated_position_list.extend([{
			"position": newest_updated_fen,
			"last_dragged_square": starting_square,
			"last_dropped_square": destination_square
		}])

		await self.update_game_attribute(chess_game_model, "position_list", updated_position_list)
		await self.save_chess_game_model(chess_game_model)

	async def append_to_move_list(self, chess_game_model: ChessGame, parsed_fen, move_info: dict):
		board_placement = parsed_fen["board_placement"]
		en_passant_target_square = parsed_fen["en_passant_target_square"]

		current_move_list = await self.get_game_attribute(chess_game_model, "move_list")
		updated_move_list: list[list] = copy.deepcopy(current_move_list)

		parsed_notation = get_algebraic_notation(
			board_placement, en_passant_target_square, move_info)

		if len(current_move_list) <= 0:
			updated_move_list.append([parsed_notation])
		else:
			last_move = current_move_list[-1]
			if len(last_move) == 2:
				updated_move_list.append([parsed_notation])
			else:
				updated_move_list[-1].append(parsed_notation)

		await self.update_game_attribute(chess_game_model, "move_list", updated_move_list)

	async def modify_castling_rights(self, chess_game_model: ChessGame, castling_side: str, color: str, new_value: bool = False):
		new_castling_rights = copy.deepcopy(chess_game_model.castling_rights)

		new_castling_rights[color.capitalize(
		)][castling_side.capitalize()] = new_value

		chess_game_model.castling_rights = new_castling_rights

		await self.save_chess_game_model(chess_game_model)

	async def handle_castling(self, chess_game_model: ChessGame, move_info: dict, original_board_placement: dict):
		new_board_placement = copy.deepcopy(original_board_placement)

		destination_square = move_info["destination_square"]
		initial_square = move_info["initial_square"] if "initial_square" in move_info.keys(
		) else None

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
			original_kingside_rook_square = str(int(destination_square) + 1)
			castled_kingside_rook_square = str(int(destination_square) - 1)

			new_board_placement[castled_kingside_rook_square] = {
				"piece_type": "Rook",
				"piece_color": piece_color,
				"starting_square": original_kingside_rook_square
			}

			del new_board_placement[original_kingside_rook_square]

		return new_board_placement

	async def end_game(self, chess_game_model: ChessGame, game_result: str):
		await self.update_game_attribute(chess_game_model, "game_status", "Ended")
		await self.update_game_attribute(chess_game_model, "game_result", game_result)

	async def handle_pawn_promotion(self, move_info: dict, original_board_placement: dict):
		destination_square = move_info["destination_square"]
		initial_square = move_info["initial_square"] if "initial_square" in move_info.keys(
		) else None

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

	async def update_en_passant_target_square(self, chess_game_model: ChessGame, move_info: dict):
		en_passant_update_start = perf_counter()

		piece_color: str = move_info["piece_color"]
		piece_type: str = move_info["piece_type"]
		starting_square = move_info["starting_square"]
		destination_square = move_info["destination_square"]

		if piece_type.lower() != "pawn":
			chess_game_model.en_passant_target_square = None
			await self.save_chess_game_model(chess_game_model)

			return

		rank_diff = abs(get_row(starting_square) - get_row(destination_square))
		if rank_diff != 2:
			chess_game_model.en_passant_target_square = None
			await self.save_chess_game_model(chess_game_model)

			return

		target_square_offset = -8 if piece_color.lower() == "white" else 8
		en_passant_target_square = int(
			destination_square) + target_square_offset

		chess_game_model.en_passant_target_square = en_passant_target_square
		await self.save_chess_game_model(chess_game_model)

		en_passant_update_end = perf_counter()

	async def increment_move_number(self, chess_game_model: ChessGame):
		current_move = await self.get_game_attribute(chess_game_model, "current_move")

		await self.update_game_attribute(chess_game_model, "current_move", current_move + 1)

	async def update_position(self, chess_game_model: ChessGame, move_info: dict):
		original_parsed_fen = copy.deepcopy(await chess_game_model.get_full_parsed_fen())
		new_board_placement = copy.deepcopy(
			await self.get_game_attribute(chess_game_model, "parsed_board_placement"))
		starting_square = move_info["starting_square"]
		destination_square = move_info["destination_square"]
		initial_square = move_info["initial_square"] if "initial_square" in move_info.keys(
		) else None

		piece_color: str = move_info["piece_color"]
		piece_type: str = move_info["piece_type"]
		additonal_info: dict = move_info["additional_info"]

		del new_board_placement[str(starting_square)]

		file_diff = abs(get_file(starting_square) -
						get_file(destination_square))

		if piece_type.lower() == "king":
			if file_diff == 2:
				new_board_placement = await self.handle_castling(chess_game_model, move_info, new_board_placement)

		elif piece_type.lower() == "rook":
			kingside_rook_starting_squares = [7, 63]

			castling_side = "Kingside" if int(
				initial_square) in kingside_rook_starting_squares else "Queenside"

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

			if chess_game_model.en_passant_target_square:
				if int(destination_square) == int(chess_game_model.en_passant_target_square):
					captured_pawn_offset = -8 if piece_color.lower() == "white" else 8
					captured_pawn_square = int(
						destination_square) + captured_pawn_offset

					del new_board_placement[str(captured_pawn_square)]

		new_side_to_move = "black" if piece_color.lower() == "white" else "white"

		await self.update_en_passant_target_square(chess_game_model, move_info)

		await self.update_game_attribute(chess_game_model, "parsed_board_placement", new_board_placement)
		await self.update_game_attribute(chess_game_model, "current_player_turn", new_side_to_move)

		if piece_color.lower() == "black":
			await self.increment_move_number(chess_game_model)

		await self.save_chess_game_model(chess_game_model)

		await self.append_to_position_list(chess_game_model, move_info)
		await self.append_to_move_list(chess_game_model, original_parsed_fen, move_info)

	async def handle_player_timeout(self, chess_game_model: ChessGame, timeout_color: str):
		await chess_game_model.async_end_game("Timeout")

		await self.channel_layer.group_send(
			self.room_group_name,
			{
				"type": "player_timeout",
				"timeout_color": timeout_color
			}
		)

		print("Successfully sent timeout message!")

	async def connect(self):
		query_string: bytes = self.scope.get("query_string", b"")
		decoded_query_string = query_string.decode()

		game_id = parse_qs(decoded_query_string)["gameId"][0]

		await self.accept()

		self.room_group_name = f"game_{game_id}"
		self.game_id = game_id
		self.chess_game_model: ChessGame = await self.get_chess_game(self.game_id)
		self.white_player_user = await self.get_game_attribute(self.chess_game_model, "white_player")
		self.black_player_user = await self.get_game_attribute(self.chess_game_model, "black_player")

		is_timer_running = await self.get_game_attribute(self.chess_game_model, "is_timer_running")
		room_group_exists = timer_tasks_info.get(self.room_group_name)
		timer_task_exists = None
		if room_group_exists:
			timer_task_exists = timer_tasks_info[self.room_group_name].get(
				"timer_task")

		if not is_timer_running and not timer_task_exists:
			timer_task = asyncio.create_task(self.handle_timer_decrement())

			if self.room_group_name not in timer_tasks_info.keys():
				timer_tasks_info[self.room_group_name] = {
					"timer_task": timer_task
				}

			await self.update_game_attribute(self.chess_game_model, "is_timer_running", True)
			await self.update_game_attribute(self.chess_game_model, "timer_initiator", self.scope["user"])

		self.timer_lock = Lock()

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
		await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

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
		chess_game_model = await self.get_chess_game(self.game_id)

		timer_task = None

		if timer_tasks_info.get(self.room_group_name):
			if timer_tasks_info[self.room_group_name].get("timer_task"):
				timer_task = timer_tasks_info[self.room_group_name]["timer_task"]
				timer_task.cancel()
				del timer_tasks_info[self.room_group_name]["timer_task"]

		move_is_valid: bool = await self.check_move_validation(json.loads(event["move_data"]))

		chess_game_model: ChessGame = await self.get_chess_game(self.game_id)
		previous_position: dict = copy.deepcopy(
			await self.get_game_attribute(chess_game_model, "parsed_board_placement"))
		en_passant_target_square = chess_game_model.en_passant_target_square

		parsed_move_data: dict = json.loads(event["move_data"])

		white_player_username = await self.white_player_user.async_get_player_username()
		black_player_username = await self.black_player_user.async_get_player_username()

		white_player_increment = await self.get_game_attribute(chess_game_model, "white_player_increment")
		black_player_increment = await self.get_game_attribute(chess_game_model, "black_player_increment")

		if white_player_username == event["move_made_by"]:
			await self.increment_white_player_timer(chess_game_model, white_player_increment)
		elif black_player_username == event["move_made_by"]:
			await self.increment_black_player_timer(chess_game_model, black_player_increment)

		new_white_player_clock = await self.get_game_attribute(chess_game_model, "white_player_clock")
		new_black_player_clock = await self.get_game_attribute(chess_game_model, "black_player_clock")

		current_move_number = await self.get_game_attribute(chess_game_model, "current_move")

		if move_is_valid:
			piece_color = parsed_move_data["piece_color"]

			await self.update_position(chess_game_model, parsed_move_data)

			new_position_list = await self.get_game_attribute(chess_game_model, "position_list")
			new_move_list = await self.get_game_attribute(chess_game_model, "move_list")
			new_parsed_fen = await chess_game_model.get_full_parsed_fen()

			opposing_color = get_opposite_color(piece_color.lower())
			is_checkmated = get_is_checkmated(new_parsed_fen, opposing_color)
			is_stalemated = get_is_stalemated(new_parsed_fen, opposing_color)

			position_index = calculate_position_index(
				piece_color, current_move_number)

			await self.send(json.dumps({
				"type": "position_list_updated",
				"new_position_list": new_position_list,
			}))

			await self.send(json.dumps({
				"type": "move_list_updated",
				"new_move_list": new_move_list,
			}))

			await self.send(json.dumps({
				"type": "move_made",
				"move_data": parsed_move_data,
				"move_type": get_move_type(previous_position, en_passant_target_square, parsed_move_data),
				"move_made_by": event["move_made_by"],
				"move_is_valid": move_is_valid,
				"new_parsed_fen": new_parsed_fen,
				"new_position_index": position_index,
			}))

			if is_checkmated:
				await chess_game_model.async_end_game(f"{piece_color.capitalize()} won")

				await self.send(json.dumps({
					"type": "player_checkmated",
					"winning_color": piece_color,
					"winning_player": event["move_made_by"],
				}))

			if is_stalemated:
				await chess_game_model.async_end_game("Draw")

				await self.send(json.dumps({
					"type": "player_stalemated",
				}))

			if timer_task:
				await self.send(json.dumps({
					"type": "timer_incremented",
					"white_player_clock": float(new_white_player_clock),
					"black_player_clock": float(new_black_player_clock)
				}))

		new_timer_task_exists = timer_tasks_info[self.room_group_name].get(
			"timer_task")
		if not new_timer_task_exists:
			new_timer_task = asyncio.create_task(self.handle_timer_decrement())
			timer_tasks_info[self.room_group_name]["timer_task"] = new_timer_task

	async def timer_decremented(self, event):
		if self.channel_name:
			await self.send(json.dumps({
				"type": "timer_decremented",
				"white_player_clock": float(event["white_player_clock"]),
				"black_player_clock": float(event["black_player_clock"]),
			}))

	async def player_timeout(self, event):
		if self.channel_name:
			await self.send(json.dumps({
				"type": "player_timeout",
				"timeout_color": event["timeout_color"]
			}))

			print("Sent message to clients!")

	async def resume_timer(self, event):
		asyncio.create_task(self.handle_timer_decrement())


class ResignConsumer(AsyncWebsocketConsumer):
	@database_sync_to_async
	def get_chess_game(self, chess_game_id) -> ChessGame:
		return ChessGame.objects.get(id=chess_game_id)

	@database_sync_to_async
	def get_game_attribute(self, chess_game_model: ChessGame, attribute_name: str):
		return getattr(chess_game_model, attribute_name)

	@database_sync_to_async
	def update_game_attribute(self, chess_game_model: ChessGame, attribute: str, new_value):
		setattr(chess_game_model, attribute, new_value)
		chess_game_model.save()

	async def get_game_winner_from_resigning_player(self, chess_game_model: ChessGame, resigning_player):
		white_player = await chess_game_model.async_get_game_attribute("white_player")
		black_player = await chess_game_model.async_get_game_attribute("black_player")

		print(type(white_player), type(black_player))
		print(white_player, black_player)

		white_player_username = await white_player.async_get_player_username()
		black_player_username = await black_player.async_get_player_username()

		if resigning_player == white_player_username:
			return "Black"
		elif resigning_player == black_player_username:
			return "White"

	async def get_game_result_from_resigning_player(self, chess_game_model: ChessGame, resigning_player):
		white_player = await self.get_game_attribute(chess_game_model, "white_player")
		black_player = await self.get_game_attribute(chess_game_model, "black_player")

		if resigning_player == white_player:
			return "Black won"
		elif resigning_player == black_player:
			return "White won"

	async def connect(self):
		query_string: bytes = self.scope.get("query_string")
		decoded_query_string = query_string.decode()

		game_id = int(parse_qs(decoded_query_string)["gameId"][0])

		await self.accept()

		self.game_id = game_id
		self.room_group_name = f"resign_room_{game_id}"
		self.chess_game_model: ChessGame = await self.get_chess_game(self.game_id)

		await self.channel_layer.group_add(
			self.room_group_name,
			self.channel_name
		)

	async def receive(self, text_data=None, bytes_data=None):
		resigner = self.scope["user"].username

		chess_game_model: ChessGame = await self.get_chess_game(self.game_id)
		winning_color = await self.get_game_winner_from_resigning_player(chess_game_model, resigner)

		await self.channel_layer.group_send(
			self.room_group_name,
			{
				"type": "player_resigned",
				"resigner": resigner,
						"winning_color": winning_color,
			}
		)

		await chess_game_model.async_end_game("Resigned")

	async def player_resigned(self, event):
		await self.send(json.dumps({
			"type": "player_resigned",
			"resigner": event["resigner"],
			"winning_color": event["winning_color"]
		}))
