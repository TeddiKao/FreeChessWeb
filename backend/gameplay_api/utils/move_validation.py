from .general import get_file, get_row, get_square

piece_directions_mapping = {
    "rook": ["north", "south", "east", "west"],
    "bishop": ["northeast", "southeast", "northwest", "southwest"],
    "queen": ["north", "south", "east", "west", "northeast", "southeast", "northwest", "southwest"]
}

def get_sliding_piece_legal_moves(board_placement, move_info):
	legal_squares = []

	piece_type = move_info["piece_type"]
	piece_color = move_info["piece_color"]

	piece_file = get_file(move_info["starting_square"])
	piece_rank = get_row(move_info["starting_square"])
	
	distance_north = 7 - piece_rank
	distance_south = piece_rank
	distance_east = 7 - piece_file
	distance_west = piece_file

	print(f"Piece rank: {piece_rank}")

	if piece_type.lower() == "rook":
		if distance_north != 0:
			for rank in range(piece_rank + 1, 7):
				square = f"{get_square(piece_file, rank)}"

				print(board_placement)
				if square in board_placement:
					if board_placement[square]["piece_color"] == piece_color:
						break
					else:
						legal_squares.append(square)
						break

				legal_squares.append(square)

		if distance_south != 0:
			for rank in range(0, piece_rank + 1):
				square = f"{get_square(rank, piece_file)}"
				
				if square in board_placement:
					if board_placement[square]["piece_color"] == piece_color:
						break
					else:
						legal_squares.append(square)
						break

				legal_squares.append(square)

		if distance_east != 0:
			for file in range(piece_file + 1, 7):
				square = f"{get_square(file, piece_rank)}"
				
				if square in board_placement:
					if board_placement[square]["piece_color"] == piece_color:
						break
					else:
						legal_squares.append(square)
						break

				legal_squares.append(square)

		if distance_west != 0:
			for file in range(0, piece_file + 1):
				square = f"{get_square(file, piece_rank)}"
				
				if square in board_placement:
					if board_placement[square]["piece_color"] == piece_color:
						break
					else:
						legal_squares.append(square)
						break

				legal_squares.append(square)

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