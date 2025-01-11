# Queen, rook or bishop
def validate_sliding_pieces_move(move_info):
	pass

def validate_move(current_fen, move_info):
	sliding_pieces = ["queen", "rook", "bishop"]
	move_is_valid = False

	if move_info["piece_type"] in sliding_pieces:
		move_is_valid = validate_sliding_pieces_move(move_info)

	return move_is_valid