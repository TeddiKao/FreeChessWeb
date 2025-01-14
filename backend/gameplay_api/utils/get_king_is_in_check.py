from .general import get_pawn_attacking_squares
from .show_legal_moves import get_legal_moves

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
