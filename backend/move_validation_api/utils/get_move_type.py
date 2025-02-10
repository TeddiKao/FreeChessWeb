from .get_legal_moves import is_king_in_check
from .legal_move_helpers import update_FEN
from .general import *

def get_is_castling(move_info: dict) -> bool:
	piece_type: str = move_info["piece_type"]
	piece_color: str = move_info["piece_color"]
	starting_square: str = move_info["starting_square"]
	destination_square: str = move_info["destination_square"]

	if piece_type.lower() != "king":
		return False

	file_diff = abs(get_file(starting_square) - get_file(destination_square))
	if file_diff != 2:
		return False
	
	return True

def get_is_check(board_placement: dict, move_info: dict) -> bool:
	starting_square = move_info["starting_square"]
	piece_type = move_info["piece_type"]
	piece_color = move_info["piece_color"]
	destination_square = move_info["destination_square"]

	updated_board_placement = update_FEN(board_placement, {
		"piece_type": piece_type,
		"piece_color": piece_color,
		"starting_square": starting_square
	}, destination_square, move_info["additional_info"])

	king_position = get_king_position(board_placement, get_opposite_color(piece_color))
	king_in_check = is_king_in_check(updated_board_placement, get_opposite_color(piece_color), king_position)

	return king_in_check

def get_is_capture(board_placement: dict, move_info: dict) -> bool:
	piece_color = move_info["piece_color"]
	destination_square = move_info["destination_square"]

	if destination_square not in board_placement.keys():
		return False
	
	destination_square_info: dict = board_placement[str(destination_square)]
	destination_square_piece_color: str = destination_square_info["piece_color"]

	if destination_square_piece_color.lower() == piece_color.lower():
		return False
	
	return True

def get_is_promotion(move_info) -> bool:
	piece_color: str = move_info["piece_color"]
	piece_type: str = move_info["piece_type"]
	destination_square: str = move_info["destination_square"]
	additional_info: dict = move_info["additional_info"]

	promotion_rank = 7 if piece_color.lower() == "white" else 0
	destination_rank = get_row(str(destination_square))

	if piece_type.lower() != "pawn":
		return False
	
	if "promoted_piece" not in additional_info:
		if int(destination_rank) == int(promotion_rank):
			return "No sound"

	return int(destination_rank) == int(promotion_rank)

def get_move_type(board_placement, move_info) -> str:
	is_check = get_is_check(board_placement, move_info)
	
	if is_check:
		return "check"
	
	is_castling = get_is_castling(move_info)
	is_capture = get_is_capture(board_placement, move_info)
	is_promotion = get_is_promotion(move_info)

	if is_castling:
		return "castling"

	if is_promotion:
		return "promotion" if is_promotion != "No sound" else "No sound"
	
	if is_capture:
		return "capture"

	return "move"




	