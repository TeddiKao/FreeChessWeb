import copy

from .general import *

def update_FEN(original_board_placement, starting_square_info, destination_square, additional_info: dict = {}):
	updated_board_placement = copy.deepcopy(original_board_placement)

	del updated_board_placement[starting_square_info["starting_square"]]
	
	if "promoted_piece" in additional_info.keys():
		updated_board_placement[str(destination_square)] = {
			"piece_type": additional_info["promoted_piece"],
			"piece_color": starting_square_info["piece_color"],
		}
	else:
		updated_board_placement[f"{destination_square}"] = {
			"piece_type": starting_square_info["piece_type"],
			"piece_color": starting_square_info["piece_color"]
		}

	return updated_board_placement