import copy

from .general import get_file, get_row, get_square, is_square_on_edge

piece_directions_mapping = {
    "rook": ["north", "south", "east", "west"],
    "bishop": ["northeast", "southeast", "northwest", "southwest"],
    "queen": ["north", "south", "east", "west", "northeast", "southeast", "northwest", "southwest"]
}

def get_legal_moves_in_direction(board_placement, start_square, directions, piece_color):
	print(f"List of directions: {directions}")
	
	legal_squares = []
	
	piece_file = get_file(start_square)
	piece_rank = get_row(start_square)

	for direction in directions:
		print(direction)

		if direction == "north":
			for rank in range(piece_rank + 1, 8):
				print(rank)

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
			print(piece_rank)

			for rank in range(piece_rank - 1, -1, -1):
				print(rank)
				square = f"{get_square(piece_file, rank)}"

				if square in board_placement:
					if board_placement[square]["piece_color"] == piece_color:
						break
					else:
						legal_squares.append(square)
						break

				legal_squares.append(square)

		elif direction == "east":
			print(f"File {piece_file}")

			for file in range(piece_file + 1, 8):
				print(file)
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

		# TODO: Add bishop movements
		elif direction == "northwest":
			square = get_square(piece_file, piece_rank)
			while True:
				square += 7
				legal_squares.append(f"{square}")

				if f"{square}" in board_placement:
					if board_placement[f"{square}"]["piece_color"] == piece_color:
						break
					else:
						legal_squares.append(square)
						break

				if is_square_on_edge(f"{square}"):
					break

		elif direction == "southwest":
			square = get_square(piece_file, piece_rank)
			while True:
				square -= 9
				legal_squares.append(f"{square}")

				if f"{square}" in board_placement:
					if board_placement[f"{square}"]["piece_color"] == piece_color:
						break
					else:
						legal_squares.append(square)
						break

				if is_square_on_edge(f"{square}"):
					break

		elif direction == "northeast":
			square = get_square(piece_file, piece_rank)
			while True:
				square += 9
				legal_squares.append(f"{square}")

				if f"{square}" in board_placement:
					if board_placement[f"{square}"]["piece_color"] == piece_color:
						break
					else:
						legal_squares.append(square)
						break

				if is_square_on_edge(f"{square}"):
					break

		elif direction == "southeast":
			square = get_square(piece_file, piece_rank)
			while True:
				square -= 7
				legal_squares.append(f"{square}")

				if f"{square}" in board_placement:
					if board_placement[f"{square}"]["piece_color"] == piece_color:
						break
					else:
						legal_squares.append(square)
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
	print(f"Starting square: {starting_square}")

	piece_color = move_info["piece_color"]

	if piece_color.lower() == "white":
		if f"{int(starting_square) + 7}" in board_placement:
			legal_squares.append(f"{int(starting_square) + 7}")

		if f"{int(starting_square) + 9}" in board_placement:
			legal_squares.append(f"{int(starting_square) + 9}")

		if f"{int(starting_square) + 8}" in board_placement:
			return legal_squares
		
		legal_squares.append(f"{int(starting_square) + 8}")

		print(starting_square)

		if get_row(starting_square) == 1:
			if f"{int(starting_square) + 16}" in board_placement:
				return legal_squares

			legal_squares.append(f"{int(starting_square) + 16}") 

	else:
		if f"{int(starting_square) - 7}" in board_placement:
				legal_squares.append(f"{int(starting_square) - 7}")

		if f"{int(starting_square) - 9}" in board_placement:
			legal_squares.append(f"{int(starting_square) - 9}")

		if f"{int(starting_square) - 8}" in board_placement:
			return legal_squares

		legal_squares.append(f"{int(starting_square) - 8}")

		if get_row(starting_square) == 6:
			if f"{int(starting_square) - 16}" in board_placement:
				return legal_squares

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

	for legal_move in legal_moves:
		if f"{legal_move}" in board_placement:
			if board_placement[f"{legal_move}"]["piece_color"].lower() == move_info["piece_color"].lower():
				cleaned_legal_moves.remove(legal_move)

	for legal_move in legal_moves:
		if abs(get_file(f"{legal_move}") - get_file(starting_square)) > 1:
			cleaned_legal_moves.remove(legal_move)
			continue

		if abs(get_row(f"{legal_move}") - get_row(starting_square)) > 1:
			cleaned_legal_moves.remove(legal_move)
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
	print(legal_moves, cleaned_legal_moves)

	for legal_move in legal_moves:
		if f"{legal_move}" in board_placement:
			print(board_placement[f"{legal_move}"]["piece_color"].lower())
			print(move_info["piece_color"])
			
			if board_placement[f"{legal_move}"]["piece_color"].lower() == move_info["piece_color"].lower():
				print(f"{legal_move}", cleaned_legal_moves)
				print(f"{legal_move}" in cleaned_legal_moves)
				cleaned_legal_moves.remove(f"{legal_move}")

	for legal_move in legal_moves:
		if abs(get_file(f"{legal_move}") - get_file(f"{starting_square}")) > 2:
			if legal_move in cleaned_legal_moves:
				print(f"{legal_move}")
			
				print(f"Inside: {f"{legal_move}" in cleaned_legal_moves}")
				cleaned_legal_moves.remove(f"{legal_move}")
				continue

		if abs(get_row(legal_move) - get_row(starting_square)) > 2:
			if legal_move in cleaned_legal_moves:
				cleaned_legal_moves.remove(f"{legal_move}")
				continue

	return cleaned_legal_moves

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

		move_is_valid = destination_square in legal_moves

	elif move_info["piece_type"].lower() == "king":
		legal_moves = get_king_legal_moves(current_fen["board_placement"], move_info)
		
		move_is_valid = destination_square in legal_moves

	elif move_info["piece_type"].lower() == "knight":
		legal_moves = get_knight_legal_moves(current_fen["board_placement"], move_info)
		
		move_is_valid = destination_square in legal_moves

	return move_is_valid