from .get_legal_moves import is_king_in_check, get_legal_moves
from .general import get_king_position

def is_stalemated(board_placement: dict, castling_rights: dict, king_color: str) -> bool: 
	all_legal_moves = []
	
	king_position = get_king_position(board_placement, king_color)
	king_in_check = is_king_in_check(board_placement, king_color, king_position)
	
	for square in board_placement.keys():
		piece_color = board_placement[square]["piece_color"]
		piece_type = board_placement[square]["piece_type"]

		move_info = {
			"piece_color": piece_color,
			"piece_type": piece_type,
			"starting_square": square
		}

		all_legal_moves += get_legal_moves(move_info, board_placement, castling_rights)

	legal_moves_num = len(all_legal_moves)
	if legal_moves_num == 0:
		if not king_in_check:
			return True
		
	return False

def is_checkmated(board_placement: dict, castling_rights: dict, king_color: str) -> bool:
	all_legal_moves = []
	
	king_position = get_king_position(board_placement, king_color)
	king_in_check = is_king_in_check(board_placement, king_color, king_position)
	
	for square in board_placement.keys():
		piece_color = board_placement[square]["piece_color"]
		piece_type = board_placement[square]["piece_type"]

		move_info = {
			"piece_color": piece_color,
			"piece_type": piece_type,
			"starting_square": square
		}

		all_legal_moves += get_legal_moves(move_info, board_placement, castling_rights)

	legal_moves_num = len(all_legal_moves)
	if legal_moves_num == 0:
		if king_in_check:
			return True
		
	return False