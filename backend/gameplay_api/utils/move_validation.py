from .general import get_file, get_row, get_square

piece_directions_mapping = {
    "rook": ["north", "south", "east", "west"],
    "bishop": ["northeast", "southeast", "northwest", "southwest"],
    "queen": ["north", "south", "east", "west", "northeast", "southeast", "northwest", "southwest"]
}

def get_legal_moves_in_direction(board_placement, start_square, directions, piece_color):
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
			pass

	return legal_squares


def get_sliding_piece_legal_moves(board_placement, move_info):
	legal_squares = []

	piece_type = move_info["piece_type"].lower()
	piece_color = move_info["piece_color"]

	starting_square = move_info["starting_square"]

	if piece_type.lower() == "rook":
		legal_squares = get_legal_moves_in_direction(board_placement, starting_square, piece_directions_mapping[piece_type], piece_color)

		return legal_squares

def validate_move(current_fen, move_info):
	print(f"Move info: {move_info}")

	destination_square = move_info["destination_square"]
	sliding_pieces = ["queen", "rook", "bishop"]
	
	move_is_valid = True

	if move_info["piece_type"].lower() in sliding_pieces:
		legal_moves = get_sliding_piece_legal_moves(current_fen["board_placement"], move_info)
		print(f"Legal moves {legal_moves}")
		
		move_is_valid = destination_square in legal_moves

	return move_is_valid