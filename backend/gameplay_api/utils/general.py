import math
import copy

from .show_legal_moves import get_legal_moves

def get_row(square):
	return math.ceil((int(square) + 1) / 8) - 1

def get_file(square):
	return int(square) % 8

def get_square(file, rank):
	return (rank * 8) + file

def is_square_on_edge(square):
	square_file = get_file(square)
	square_rank = get_row(square)

	edges = [0, 7]
	return square_file in edges or square_rank in edges

def is_on_same_diagonal(square1, square2):
	square1_file = get_file(square1)
	square1_rank = get_row(square1)

	square2_file = get_file(square2)
	square2_rank = get_row(square2)

	return abs(square1_file - square2_file) == abs(square1_rank - square2_rank)

def get_pawn_attacking_squares(square, pawn_color):
	attacking_squares = []

	if pawn_color == "black":
		attacking_squares += [square - 9, square - 7]
	else:
		attacking_squares += [square + 9, square + 7]

	cleaned_attacking_squares = copy.deepcopy(attacking_squares)
	for attacking_square in attacking_squares:
		if abs(get_file(square) - get_file(attacking_square)) > 1:
			cleaned_attacking_squares.remove(attacking_square)

	return cleaned_attacking_squares

def is_king_in_check(board_placement, king_color, king_square):
	attacked_squares = [];

	for square in board_placement.keys():
		piece_color = board_placement[square]["piece_color"]
		piece_type = board_placement[square]["piece_type"]
		current_square = square

		if not piece_color == king_color:
			continue

		if piece_type == "pawn":
			attacked_squares += get_pawn_attacking_squares(square, piece_color)
		else:
			attacked_squares += get_legal_moves(current_square)	

	if king_square in attacked_squares:
		return True
	else:
		return False
