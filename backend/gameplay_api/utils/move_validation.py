import copy

from .general import *
from .get_king_is_in_check import is_king_in_check

from .legal_move_helpers import *

def validate_move(current_fen, move_info):
	print(f"Move info: {move_info}")

	destination_square = move_info["destination_square"]
	sliding_pieces = ["queen", "rook", "bishop"]
	
	move_is_valid = True

	if move_info["piece_type"].lower() in sliding_pieces:
		legal_moves = get_sliding_piece_legal_moves(current_fen["board_placement"], move_info)
		
		move_is_valid = destination_square in legal_moves

	elif move_info["piece_type"].lower() == "pawn":
		legal_moves = get_pawn_legal_moves(current_fen["board_placement"], move_info)
		print(f"Pawn legal moves: {legal_moves}")

		move_is_valid = destination_square in legal_moves

	elif move_info["piece_type"].lower() == "king":
		legal_moves = get_king_legal_moves(current_fen["board_placement"], move_info)
		
		move_is_valid = destination_square in legal_moves

	elif move_info["piece_type"].lower() == "knight":
		legal_moves = get_knight_legal_moves(current_fen["board_placement"], move_info)

		move_is_valid = destination_square in legal_moves

	# move_is_valid = not is_king_in_check(current_fen, move_info["piece_color"], get_king_position(current_fen["board_placement"], move_info["piece_color"]))
	

	return move_is_valid