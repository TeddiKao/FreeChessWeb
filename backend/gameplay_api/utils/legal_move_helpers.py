import copy

from .general import *

def update_FEN(original_fen, starting_square_info, destination_square):
	updated_fen = copy.deepcopy(original_fen)

	updated_board_placement = updated_fen["board_placement"]

	del updated_board_placement[starting_square_info["starting_square"]]
	updated_board_placement[destination_square] = {
		"piece_type": starting_square_info["piece_type"],
		"piece_color": starting_square_info["piece_color"]
	}

	return updated_fen