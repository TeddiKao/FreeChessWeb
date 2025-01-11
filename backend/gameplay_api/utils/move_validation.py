from general import get_file, get_row, get_square

def get_sliding_piece_legal_moves(board_placement, move_info):
	legal_squares = []

	piece_type = move_info["piece_type"]
	piece_color = move_info["piece_color"]

	piece_file = get_file(move_info["current_square"])
	piece_rank = get_row(move_info["piece_rank"])
	
	distance_north = 7 - piece_rank
	distance_south = piece_rank
	distance_east = 7 - piece_file
	distance_west = piece_file

	if piece_type.lower() == "rook":
		for file in range(piece_rank, piece_rank + distance_north + 1):
			square = f"{get_square(piece_file, file)}"

			if board_placement[square]:
				if board_placement[square]["piece_color"] == piece_color:
					break
				else:
					legal_squares.append(square)
					break

			legal_squares.append(square)

		for file in range(piece_rank - distance_south, piece_rank + 1):
			square = f"{get_square(piece_file, file)}"
			
			if board_placement[square]:
				if board_placement[square]["piece_color"] == piece_color:
					break
				else:
					legal_squares.append(square)
					break

			legal_squares.append(square)

		for file in range(piece_file, distance_east + piece_file + 1):
			square = f"{get_square(file, piece_rank)}"
			
			if board_placement[square]:
				if board_placement[square]["piece_color"] == piece_color:
					break
				else:
					legal_squares.append(square)
					break

			legal_squares.append(square)

		for file in range(piece_file - distance_west, piece_file + 1):
			square = f"{get_square(file, piece_rank)}"
			
			if board_placement[square]:
				if board_placement[square]["piece_color"] == piece_color:
					break
				else:
					legal_squares.append(square)
					break

			legal_squares.append(square)

		return legal_squares

def validate_move(current_fen, move_info):
	destination_square = move_info["destination_square"]
	sliding_pieces = ["queen", "rook", "bishop"]
	
	move_is_valid = False

	if move_info["piece_type"] in sliding_pieces:
		legal_moves = get_sliding_piece_legal_moves(current_fen["board_placement"])
		move_is_valid = destination_square in legal_moves

	return move_is_valid