from .get_legal_moves import is_king_in_check, get_legal_moves
from .general import get_king_position

def get_is_stalemated(board_placement: dict, castling_rights: dict, king_color: str) -> bool: 
	all_legal_moves = []
	
	king_position = get_king_position(board_placement, king_color)
	king_in_check = is_king_in_check(board_placement, king_color, f"{king_position}")
	
	for square in board_placement.keys():
		piece_color: str = board_placement[square]["piece_color"]
		piece_type: str = board_placement[square]["piece_type"]

		if piece_color.lower() != king_color.lower():
			continue

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

def get_is_checkmated(board_placement: dict, castling_rights: dict, king_color: str) -> bool:
	all_legal_moves = []

	king_position = get_king_position(board_placement, king_color)
	
	print(king_color)
	king_in_check = is_king_in_check(board_placement, king_color, f"{king_position}")
	
	for square in board_placement.keys():
		piece_color: str = board_placement[square]["piece_color"]
		piece_type: str = board_placement[square]["piece_type"]

		if piece_color.lower() != king_color.lower():
			continue

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