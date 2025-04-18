from .general import *

piece_directions_mapping = {
    "rook": ["north", "south", "east", "west"],
    "bishop": ["northeast", "southeast", "northwest", "southwest"],
    "queen": ["north", "south", "east", "west", "northeast", "southeast", "northwest", "southwest"]
}

def get_attacking_squares_in_direction(board_placement, start_square, directions, piece_color):
	legal_squares = []
	
	piece_file = get_file(start_square)
	piece_rank = get_row(start_square)

	for direction in directions:
		if direction == "north":
			for rank in range(piece_rank + 1, 8):
				square = f"{get_square(piece_file, rank)}"
				if square == start_square:
					continue

				if square in board_placement:
					if board_placement[square]["piece_color"] == piece_color:
						break
					else:
						legal_squares.append(square)
	
						break

				legal_squares.append(square)

		elif direction == "south":
			for rank in range(piece_rank - 1, -1, -1):
				square = f"{get_square(piece_file, rank)}"

				if square in board_placement:
					if board_placement[square]["piece_color"] == piece_color:
						break
					else:
						legal_squares.append(square)
						break

				legal_squares.append(square)

		elif direction == "east":
			for file in range(piece_file + 1, 8):
				square = f"{get_square(file, piece_rank)}"

				if square in board_placement:
					if board_placement[square]["piece_color"] == piece_color:
						break
					else:
						legal_squares.append(square)
						break

				legal_squares.append(square)

		elif direction == "west":
			for file in range(piece_file - 1, -1, -1):
				square = f"{get_square(file, piece_rank)}"
	
				if square in board_placement:
					if board_placement[square]["piece_color"] == piece_color:
						break
					else:
						legal_squares.append(square)
						break

				legal_squares.append(square)

		elif direction == "northwest":
			square = get_square(piece_file, piece_rank)
			

			while True:
				square += 7
				

				if square < 0 or square > 63:
					break

				if not is_on_same_diagonal(start_square, square):
					break

				legal_squares.append(f"{square}")

				if f"{square}" in board_placement:
					if board_placement[f"{square}"]["piece_color"] == piece_color:
						legal_squares.remove(f"{square}")
						break
					else:
						break

				if is_square_on_edge(f"{square}"):
					break

		elif direction == "southwest":
			square = get_square(piece_file, piece_rank)
			while True:
				square -= 9

				if square < 0 or square > 63:
					break

				if not is_on_same_diagonal(start_square, square):
					break

				legal_squares.append(f"{square}")

				if f"{square}" in board_placement:
					if board_placement[f"{square}"]["piece_color"] == piece_color:
						legal_squares.remove(f"{square}")
						break
					else:
						break

				if is_square_on_edge(f"{square}"):
					break

		elif direction == "northeast":
			square = get_square(piece_file, piece_rank)
			while True:
				square += 9
				if square < 0 or square > 63:
					break

				if not is_on_same_diagonal(start_square, square):
					break

				legal_squares.append(f"{square}")

				if f"{square}" in board_placement:
					if board_placement[f"{square}"]["piece_color"] == piece_color:
						legal_squares.remove(f"{square}")
						break
					else:
						break

				if is_square_on_edge(f"{square}"):
					break

		elif direction == "southeast":
			square = get_square(piece_file, piece_rank)
			while True:
				square -= 7

				if not is_on_same_diagonal(start_square, square):
					break

				if square < 0 or square > 63:
					break

				legal_squares.append(f"{square}")

				if f"{square}" in board_placement:
					if board_placement[f"{square}"]["piece_color"] == piece_color:
						legal_squares.remove(f"{square}")
						break
					else:
						break

				if is_square_on_edge(f"{square}"):
					break

	return legal_squares


def get_sliding_piece_attacking_squares(board_placement, move_info):
	attacking_squares = []

	piece_type = move_info["piece_type"].lower()
	piece_color = move_info["piece_color"]

	starting_square = move_info["starting_square"]

	attacking_squares = get_attacking_squares_in_direction(board_placement, starting_square, piece_directions_mapping[piece_type], piece_color)

	return attacking_squares

def get_king_attacking_squares(board_placement, move_info):
	starting_square = move_info["starting_square"]

	left_square = f"{int(starting_square) + 1}"
	right_square = f"{int(starting_square) - 1}"
	up_square = f"{int(starting_square) + 8}"
	down_square = f"{int(starting_square) - 8}"
	up_left_square = f"{int(starting_square) + 7}"
	up_right_square = f"{int(starting_square) + 9}"
	down_left_square = f"{int(starting_square) - 7}"
	down_right_square = f"{int(starting_square) - 9}"

	attacking_squares = [left_square, right_square, up_square, down_square, up_left_square, up_right_square, down_left_square, down_right_square]

	cleaned_attacking_squares = copy.deepcopy(attacking_squares)

	for legal_move in attacking_squares:
		if f"{legal_move}" in board_placement:
			if board_placement[f"{legal_move}"]["piece_color"].lower() == move_info["piece_color"].lower():
				cleaned_attacking_squares.remove(f"{legal_move}")

	for legal_move in attacking_squares:
		if abs(get_file(f"{legal_move}") - get_file(starting_square)) > 1:
			if legal_move in cleaned_attacking_squares:
				cleaned_attacking_squares.remove(f"{legal_move}")
				continue

		if abs(get_row(f"{legal_move}") - get_row(starting_square)) > 1:
			if legal_move in cleaned_attacking_squares:
				cleaned_attacking_squares.remove(f"{legal_move}")
				continue

	return cleaned_attacking_squares

def get_knight_attacking_squares(board_placement, move_info):
	starting_square = move_info["starting_square"]

	legal_moves = [
		f"{int(starting_square) + 15}",
		f"{int(starting_square) + 17}",
		f"{int(starting_square) - 15}",
        f"{int(starting_square) - 17}",
        f"{int(starting_square) + 6}",
        f"{int(starting_square) - 6}",
		f"{int(starting_square) + 10}",
		f"{int(starting_square) - 10}",
	]

	cleaned_legal_moves = copy.deepcopy(legal_moves)
	
	for legal_move in legal_moves:
		if f"{legal_move}" in board_placement:
			if board_placement[f"{legal_move}"]["piece_color"].lower() == move_info["piece_color"].lower():
				cleaned_legal_moves.remove(f"{legal_move}")

	for legal_move in legal_moves:
		if abs(get_file(f"{legal_move}") - get_file(f"{starting_square}")) > 2:
			if legal_move in cleaned_legal_moves:
				cleaned_legal_moves.remove(f"{legal_move}")
				continue

		if abs(get_row(legal_move) - get_row(starting_square)) > 2:
			if legal_move in cleaned_legal_moves:
				cleaned_legal_moves.remove(f"{legal_move}")
				continue

	return cleaned_legal_moves
def get_attacking_squares_of_color(color, board_placement: dict):
	attacking_squares = []

	for square in board_placement.keys():
		piece_color = board_placement[square]["piece_color"]
		piece_type = board_placement[square]["piece_type"]

		if piece_color != color:
			continue

		move_info = {
			"piece_type": piece_type,
			"piece_color": piece_color,
			"starting_square": square
		}

		if piece_type.lower() == "pawn":
			attacking_squares += get_pawn_attacking_squares(square, piece_color)
		else:
			match piece_type.lower():
				case "knight":
					attacking_squares += get_knight_attacking_squares(board_placement, move_info)
				
				case "bishop":
					attacking_squares += get_sliding_piece_attacking_squares(board_placement, move_info)

				case "rook":
					attacking_squares += get_sliding_piece_attacking_squares(board_placement, move_info)

				case "queen":
					attacking_squares += get_sliding_piece_attacking_squares(board_placement, move_info)

				case "king":
					attacking_squares += get_king_attacking_squares(board_placement, move_info)
			
	return attacking_squares
