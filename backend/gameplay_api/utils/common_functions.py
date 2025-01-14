from .get_legal_moves import get_sliding_piece_legal_moves, get_king_legal_moves, get_knight_legal_moves, get_pawn_legal_moves


def get_legal_moves(move_info, current_fen):
	
	board_placement = current_fen["board_placement"]

	sliding_pieces = ["queen", "rook", "bishop"]

	if move_info["piece_type"].lower() == "king":
		return get_king_legal_moves(board_placement, move_info)
	
	elif move_info["piece_type"].lower() in sliding_pieces:
		return get_sliding_piece_legal_moves(board_placement, move_info)
	
	elif move_info["piece_type"].lower() == "knight":
		return get_knight_legal_moves(board_placement, move_info)
	
	elif move_info["piece_type"].lower() == "pawn":
		return get_pawn_legal_moves(board_placement, move_info)