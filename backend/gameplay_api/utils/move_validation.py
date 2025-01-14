import copy

from .general import *
from .legal_move_helpers import *
from .get_legal_moves import *

def validate_move(current_fen, move_info):
	board_placement = current_fen["board_placement"]
	piece_color = move_info["piece_color"]
	piece_type = move_info["piece_type"]

	starting_square = move_info["starting_square"]
	destination_square = move_info["destination_square"]
	sliding_pieces = ["queen", "rook", "bishop"]
	
	move_is_valid = True

	if move_info["piece_type"].lower() in sliding_pieces:
		legal_moves = get_sliding_piece_legal_moves(current_fen["board_placement"], move_info)
		
		move_is_valid = destination_square in legal_moves

	elif move_info["piece_type"].lower() == "pawn":
		legal_moves = get_pawn_legal_moves(current_fen["board_placement"], move_info)
		

		move_is_valid = destination_square in legal_moves

	elif move_info["piece_type"].lower() == "king":
		legal_moves = get_king_legal_moves(current_fen["board_placement"], move_info)
		
		move_is_valid = destination_square in legal_moves

	elif move_info["piece_type"].lower() == "knight":
		legal_moves = get_knight_legal_moves(current_fen["board_placement"], move_info)

		move_is_valid = destination_square in legal_moves

	updated_fen = copy.deepcopy(current_fen)
	del updated_fen["board_placement"][starting_square]
	updated_fen["board_placement"][destination_square] = {
		"piece_type": piece_type,
		"piece_color": piece_color
	}

	king_in_check = is_king_in_check(updated_fen, piece_color, get_king_position(updated_fen["board_placement"], piece_color))
	move_is_valid = not king_in_check

	return move_is_valid