import copy

from .general import *
from .legal_move_helpers import *
from .get_legal_moves import *

def validate_move(current_fen, move_info):
	board_placement = current_fen["board_placement"]
	castling_rights = current_fen["castling_rights"]

	piece_color = move_info["piece_color"]
	piece_type = move_info["piece_type"]

	starting_square = move_info["starting_square"]
	destination_square = move_info["destination_square"]
	sliding_pieces = ["queen", "rook", "bishop"]
	
	move_is_valid = True

	if piece_type.lower() in sliding_pieces:
		legal_moves = get_sliding_piece_legal_moves(board_placement, move_info)

		move_is_valid = destination_square in legal_moves

	elif piece_type.lower() == "pawn":
		legal_moves = get_pawn_legal_moves(board_placement, move_info)

		move_is_valid = destination_square in legal_moves

	elif piece_type.lower() == "king":
		legal_moves = get_king_legal_moves(board_placement, move_info)
		
		move_is_valid = destination_square in legal_moves

	elif piece_type.lower() == "knight":
		legal_moves = get_knight_legal_moves(board_placement, move_info)

		move_is_valid = destination_square in legal_moves

	return move_is_valid