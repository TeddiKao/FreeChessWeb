import copy

from .general import *
from .common_functions import get_legal_moves

def is_king_in_check(current_fen, king_color, king_square):
	attacked_squares = []

	board_placement = current_fen["board_placement"]

	for square in board_placement.keys():
		piece_color = board_placement[square]["piece_color"]
		piece_type = board_placement[square]["piece_type"]
		current_square = square

		if piece_color == king_color:
			continue

		if piece_type == "pawn":
			attacked_squares += get_pawn_attacking_squares(current_square, piece_color)
		else:
			attacked_squares += get_legal_moves({
				"piece_type": piece_type,
				"piece_color": piece_color,
				"starting_square": current_square
			}, current_fen)

	print(attacked_squares)
	print(king_square)

	if king_square in attacked_squares:
		return True
	else:
		return False


def update_FEN(original_fen, starting_square_info, destination_square):
	updated_fen = copy.deepcopy(original_fen)

	updated_board_placement = updated_fen["board_placement"]

	del updated_board_placement[starting_square_info["starting_square"]]
	updated_board_placement[destination_square] = {
		"piece_type": starting_square_info["piece_type"],
		"piece_color": starting_square_info["piece_color"]
	}

	return updated_fen