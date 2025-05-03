import math
import copy

files_list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

def get_row(square: str | int):
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

	file_dist = abs(square1_file - square2_file)
	rank_dist = abs(square1_rank - square2_rank)

	return file_dist == rank_dist

def get_pawn_attacking_squares(pawn_square, pawn_color):
	attacking_squares = []
	
	if pawn_color.lower() == "black":
		attacking_squares += [f"{int(pawn_square) - 9}", f"{int(pawn_square) - 7}"]
	else:
		attacking_squares += [f"{int(pawn_square) + 9}", f"{int(pawn_square) + 7}"]

	cleaned_attacking_squares = copy.deepcopy(attacking_squares)
	for attacking_square in attacking_squares:
		if abs(get_file(pawn_square) - get_file(attacking_square)) > 1:
			cleaned_attacking_squares.remove(attacking_square)

	return cleaned_attacking_squares

def get_king_position(board_placement, king_color):
	for square in board_placement.keys():
		if board_placement[square]["piece_color"].lower() == king_color.lower():
			if board_placement[square]["piece_type"].lower() == "king":
				return square

def get_opposite_color(color):
	return "Black" if color.lower() == "white" else "White"

def convert_to_algebraic_notation(square):
	square_file = get_file(square)
	square_rank = get_row(square)

	return f"{files_list[square_file]}{square_rank + 1}"

def convert_to_square_index(algebraic_notation: str):
	file = algebraic_notation[0]
	rank = algebraic_notation[1]

	file_index = files_list.index(file)

	return get_square(file_index, int(rank) - 1)

def get_all_pieces_of_color(board_placement, color: str):
	color = color.lower()

	pieces = []
	for square in board_placement.keys():
		if board_placement[square]["piece_color"].lower() == color:
			piece_type = board_placement[square]["piece_type"]
			pieces.append(piece_type)

	return pieces

def get_all_pieces_on_board(board_placement: dict):
	pieces = []
	for square in board_placement.keys():
		square_info = board_placement[square]

		pieces.append(square_info["piece_type"])

	return pieces

def square_has_piece(board_placement, square):
	return not not board_placement.get(square)

def is_square_on_board(square_number):
	return 0 <= int(square_number) <= 63

def is_on_same_file(pieces_list: list):
	file_to_check = get_file(pieces_list[0]["piece_square"])
	same_file = True

	for piece_info in pieces_list:
		piece_square = piece_info["piece_square"]
		if get_file(piece_square) != file_to_check:
			same_file = False
			break

	return same_file

def is_on_same_rank(pieces_list: list):
	rank_to_check = get_row(pieces_list[0]["piece_square"])
	same_rank = True

	print(pieces_list)

	for piece_info in pieces_list:
		piece_square = piece_info["piece_square"]
		print(type(get_row(piece_square)), type(rank_to_check))

		if get_row(piece_square) != rank_to_check:
			same_rank = False
			break

	return same_rank