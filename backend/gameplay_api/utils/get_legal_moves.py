from .general import *
from .legal_move_helpers import update_FEN
from .get_attacking_squares import get_attacking_squares_of_color

piece_directions_mapping = {
    "rook": ["north", "south", "east", "west"],
    "bishop": ["northeast", "southeast", "northwest", "southwest"],
    "queen": ["north", "south", "east", "west", "northeast", "southeast", "northwest", "southwest"]
}

def get_legal_moves(move_info, board_placement):
	sliding_pieces = ["queen", "rook", "bishop"]

	if move_info["piece_type"].lower() == "king":
		return get_king_legal_moves(board_placement, move_info)
	
	elif move_info["piece_type"].lower() in sliding_pieces:
		return get_sliding_piece_legal_moves(board_placement, move_info)
	
	elif move_info["piece_type"].lower() == "knight":
		return get_knight_legal_moves(board_placement, move_info)
	
	elif move_info["piece_type"].lower() == "pawn":
		return get_pawn_legal_moves(board_placement, move_info)

def is_king_in_check(board_placement, king_color, king_square):
	attacked_squares = get_attacking_squares_of_color(get_opposite_color(king_color), board_placement)
	

	return king_square in attacked_squares

def get_legal_moves_in_direction(board_placement, start_square, directions, piece_color):
	legal_squares = []
	
	piece_file = get_file(start_square)
	piece_rank = get_row(start_square)

	king_position = get_king_position(board_placement, piece_color)

	for direction in directions:
		if direction == "north":
			for rank in range(piece_rank + 1, 8):
				square = f"{get_square(piece_file, rank)}"
				if square == start_square:
					continue

				starting_square_info = {
					"starting_square": start_square,
					"piece_type": board_placement[start_square]["piece_type"],
					"piece_color": board_placement[start_square]["piece_color"]
				}

				if is_king_in_check(update_FEN(board_placement, starting_square_info, square), piece_color, king_position):
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

				starting_square_info = {
					"starting_square": start_square,
					"piece_type": board_placement[start_square]["piece_type"],
					"piece_color": board_placement[start_square]["piece_color"]
				}

				if is_king_in_check(update_FEN(board_placement, starting_square_info, square), piece_color, king_position):
					continue

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

				starting_square_info = {
					"starting_square": start_square,
					"piece_type": board_placement[start_square]["piece_type"],
					"piece_color": board_placement[start_square]["piece_color"]
				}

				if is_king_in_check(update_FEN(board_placement, starting_square_info, square), piece_color, king_position):
					continue

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
	
				starting_square_info = {
					"starting_square": start_square,
					"piece_type": board_placement[start_square]["piece_type"],
					"piece_color": board_placement[start_square]["piece_color"]
				}

				if is_king_in_check(update_FEN(board_placement, starting_square_info, square), piece_color, king_position):
					continue

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

				starting_square_info = {
					"starting_square": start_square,
					"piece_type": board_placement[start_square]["piece_type"],
					"piece_color": board_placement[start_square]["piece_color"]
				}

				

				if is_king_in_check(update_FEN(board_placement, starting_square_info, square), piece_color, king_position):
					continue

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

				starting_square_info = {
					"starting_square": start_square,
					"piece_type": board_placement[start_square]["piece_type"],
					"piece_color": board_placement[start_square]["piece_color"]
				}

				

				if is_king_in_check(update_FEN(board_placement, starting_square_info, square), piece_color, king_position):
					continue

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

				starting_square_info = {
					"starting_square": start_square,
					"piece_type": board_placement[f"{start_square}"]["piece_type"],
					"piece_color": board_placement[f"{start_square}"]["piece_color"]
				}

				

				if is_king_in_check(update_FEN(board_placement, starting_square_info, square), piece_color, king_position):
					continue

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

				if square < 0 or square > 63:
					break

				starting_square_info = {
					"starting_square": start_square,
					"piece_type": board_placement[f"{start_square}"]["piece_type"],
					"piece_color": board_placement[f"{start_square}"]["piece_color"]
				}

				if is_king_in_check(update_FEN(board_placement, starting_square_info, square), piece_color, king_position):
					continue

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


def get_sliding_piece_legal_moves(board_placement, move_info):
	legal_squares = []

	piece_type = move_info["piece_type"].lower()
	piece_color = move_info["piece_color"]

	starting_square = move_info["starting_square"]

	legal_squares = get_legal_moves_in_direction(board_placement, starting_square, piece_directions_mapping[piece_type], piece_color)

	return legal_squares

def get_pawn_legal_moves(board_placement, move_info):
	legal_squares = []

	starting_square = move_info["starting_square"]
	piece_color = move_info["piece_color"]

	starting_square_info = {
		"starting_square": starting_square,
		"piece_color": board_placement[f"{starting_square}"]["piece_color"],
		"piece_type": board_placement[f"{starting_square}"]["piece_type"]
	}

	if piece_color.lower() == "white":
		if f"{int(starting_square) + 7}" in board_placement:
			if board_placement[f"{int(starting_square) + 7}"]["piece_color"] != move_info["piece_color"]:
				updated_FEN = update_FEN(board_placement, starting_square_info, f"{int(starting_square) + 7}")
				king_position = get_king_position(updated_FEN, piece_color)
				
				if not is_king_in_check(updated_FEN, piece_color, king_position):
					legal_squares.append(f"{int(starting_square) + 7}")

		if f"{int(starting_square) + 9}" in board_placement:
			if board_placement[f"{int(starting_square) + 9}"]["piece_color"] != move_info["piece_color"]:
				updated_FEN = update_FEN(board_placement, starting_square_info, f"{int(starting_square) + 9}")
				king_position = get_king_position(updated_FEN, piece_color)
				
				if not is_king_in_check(updated_FEN, piece_color, king_position):
					legal_squares.append(f"{int(starting_square) + 9}")

		if f"{int(starting_square) + 8}" in board_placement:
			return legal_squares
		
		updated_FEN = update_FEN(board_placement, starting_square_info, f"{int(starting_square) + 8}")
		king_position = get_king_position(updated_FEN, piece_color)
		
		if not is_king_in_check(updated_FEN, piece_color, king_position):
			legal_squares.append(f"{int(starting_square) + 8}")

		if get_row(starting_square) == 1:
			if f"{int(starting_square) + 16}" in board_placement:
				return legal_squares
			
			updated_FEN = update_FEN(board_placement, starting_square_info, f"{int(starting_square) + 16}")
			king_position = get_king_position(updated_FEN, piece_color)

			if not is_king_in_check(updated_FEN, piece_color, king_position):
				legal_squares.append(f"{int(starting_square) + 16}")

	else:
		if f"{int(starting_square) - 7}" in board_placement:
			if board_placement[f"{int(starting_square) - 7}"]["piece_color"] != move_info["piece_color"]:
				updated_FEN = update_FEN(board_placement, starting_square_info, f"{int(starting_square) - 7}")
				king_position = get_king_position(updated_FEN, piece_color)
				
				if not is_king_in_check(updated_FEN, piece_color, king_position):
					legal_squares.append(f"{int(starting_square) - 7}")

		if f"{int(starting_square) - 9}" in board_placement:
			if board_placement[f"{int(starting_square) - 9}"]["piece_color"] != move_info["piece_color"]:
				updated_FEN = update_FEN(board_placement, starting_square_info, f"{int(starting_square) - 9}")
				king_position = get_king_position(updated_FEN, piece_color)

				if not is_king_in_check(updated_FEN, piece_color, king_position):
					legal_squares.append(f"{int(starting_square) - 9}")

		updated_FEN = update_FEN(board_placement, starting_square_info, f"{int(starting_square) - 8}")
		king_position = get_king_position(updated_FEN, piece_color)

		if f"{int(starting_square) - 8}" in board_placement:
			return legal_squares

		if not is_king_in_check(updated_FEN, piece_color, king_position):
			legal_squares.append(f"{int(starting_square) - 8}")

		if get_row(starting_square) == 6:
			if f"{int(starting_square) - 16}" in board_placement:
				return legal_squares

			updated_FEN = update_FEN(board_placement, starting_square_info, f"{int(starting_square) - 16}")
			king_position = get_king_position(updated_FEN, piece_color)

			if not is_king_in_check(updated_FEN, piece_color, get_king_position(board_placement, piece_color)):
				legal_squares.append(f"{int(starting_square) - 16}")

	return legal_squares

def get_king_legal_moves(board_placement, move_info):
	starting_square = move_info["starting_square"]

	left_square = f"{int(starting_square) + 1}"
	right_square = f"{int(starting_square) - 1}"
	up_square = f"{int(starting_square) + 8}"
	down_square = f"{int(starting_square) - 8}"
	up_left_square = f"{int(starting_square) + 7}"
	up_right_square = f"{int(starting_square) + 9}"
	down_left_square = f"{int(starting_square) - 7}"
	down_right_square = f"{int(starting_square) - 9}"

	legal_moves = [left_square, right_square, up_square, down_square, up_left_square, up_right_square, down_left_square, down_right_square]

	cleaned_legal_moves = copy.deepcopy(legal_moves)

	starting_square_info = {
		"starting_square": starting_square,
		"piece_type": board_placement[starting_square]["piece_type"],
		"piece_color": board_placement[starting_square]["piece_color"]
	}

	for legal_move in legal_moves:
		if f"{legal_move}" in board_placement:
			if board_placement[f"{legal_move}"]["piece_color"].lower() == move_info["piece_color"].lower():
				cleaned_legal_moves.remove(f"{legal_move}")

	for legal_move in legal_moves:
		updated_board_placement = update_FEN(board_placement, starting_square_info, legal_move)
		king_position = get_king_position(updated_board_placement, move_info["piece_color"])

		if abs(get_file(f"{legal_move}") - get_file(starting_square)) > 1:
			if legal_move in cleaned_legal_moves:
				cleaned_legal_moves.remove(f"{legal_move}")
				continue


		if abs(get_row(f"{legal_move}") - get_row(starting_square)) > 1:
			if legal_move in cleaned_legal_moves:
				cleaned_legal_moves.remove(f"{legal_move}")
				continue


		if is_king_in_check(updated_board_placement, move_info["piece_color"], king_position):
			if legal_move in cleaned_legal_moves:
				cleaned_legal_moves.remove(f"{legal_move}")
				continue

	return cleaned_legal_moves

def get_knight_legal_moves(board_placement, move_info):
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
		starting_square_info = {
			"starting_square": starting_square,
			"piece_type": board_placement[starting_square]["piece_type"],
			"piece_color": board_placement[starting_square]["piece_color"]
		}

		updated_board_placement = update_FEN(board_placement, starting_square_info, legal_move)
		king_position = get_king_position(updated_board_placement, move_info["piece_color"])

		if abs(get_file(f"{legal_move}") - get_file(f"{starting_square}")) > 2:
			if legal_move in cleaned_legal_moves:
				cleaned_legal_moves.remove(f"{legal_move}")
				continue

		if abs(get_row(legal_move) - get_row(starting_square)) > 2:
			if legal_move in cleaned_legal_moves:
				cleaned_legal_moves.remove(f"{legal_move}")
				continue

		if is_king_in_check(updated_board_placement, move_info["piece_color"], king_position):
			if legal_move in cleaned_legal_moves:
				cleaned_legal_moves.remove(f"{legal_move}")
				continue

	return cleaned_legal_moves