from .general import *
from .legal_move_helpers import update_FEN
from .get_attacking_squares import get_attacking_squares_of_color

piece_directions_mapping = {
    "rook": ["north", "south", "east", "west"],
    "bishop": ["northeast", "southeast", "northwest", "southwest"],
    "queen": ["north", "south", "east", "west", "northeast", "southeast", "northwest", "southwest"]
}

direction_offset_mapping = {
	"northwest": 7,
	"northeast": 9,
	"southwest": -9,
	"southeast": -7,
}

def get_legal_moves(move_info, board_placement, castling_rights = None):
	sliding_pieces = ["queen", "rook", "bishop"]

	if move_info["piece_type"].lower() == "king":
		return get_king_legal_moves(board_placement, castling_rights, move_info)
	
	elif move_info["piece_type"].lower() in sliding_pieces:
		return get_sliding_piece_legal_moves(board_placement, move_info)
	
	elif move_info["piece_type"].lower() == "knight":
		return get_knight_legal_moves(board_placement, move_info)
	
	elif move_info["piece_type"].lower() == "pawn":
		return get_pawn_legal_moves(board_placement, move_info)

def is_king_in_check(board_placement, king_color, king_square):
	attacked_squares = get_attacking_squares_of_color(get_opposite_color(king_color), board_placement)

	return king_square in attacked_squares

def get_legal_moves_in_diagonal_direction(board_placement, move_info, piece_location, square_offset):
	legal_squares = []

	piece_file = piece_location["piece_file"]
	piece_rank = piece_location["piece_rank"]

	square = get_square(piece_file, piece_rank)

	start_square = move_info["starting_square"]
	piece_color = move_info["piece_color"]
	
	while True:
		square += square_offset
		if square < 0 or square > 63:
			break

		starting_square_info = {
			"starting_square": start_square,
			"piece_type": board_placement[start_square]["piece_type"],
			"piece_color": board_placement[start_square]["piece_color"]
		}

		updated_board_placement = update_FEN(board_placement, starting_square_info, square)
		king_position = get_king_position(board_placement, piece_color)
		king_in_check = False

		if is_king_in_check(updated_board_placement, piece_color, king_position):
			king_in_check = True

		if not king_in_check:
			legal_squares.append(f"{square}")

		if not is_on_same_diagonal(start_square, square):
			break

		if f"{square}" in board_placement:
			if board_placement[f"{square}"]["piece_color"] == piece_color:
				if f"{square}" in legal_squares:
					legal_squares.remove(f"{square}")
				
				break
			else:
				break

		if is_square_on_edge(f"{square}"):
			break

	return legal_squares

def get_legal_moves_in_straight_direction(board_placemeent, constant_value_str, direction, move_info, piece_location):
	legal_squares = []
	
	start_square = move_info["starting_square"]
	piece_color = move_info["piece_color"]

	piece_file = piece_location["piece_file"]
	piece_rank = piece_location["piece_rank"]

	changing_value = piece_file if constant_value_str == "rank" else piece_rank
	
	positive_directions = ["north", "east"]

	direction_type = "positive" if direction in positive_directions else "negative"
	step_value = 1 if direction_type == "positive" else -1

	starting_value = changing_value - 1 if direction_type == "negative" else changing_value + 1
	ending_value = -1 if direction_type == "negative" else 8

	for value in range(starting_value, ending_value, step_value):
		square = None
		if constant_value_str == "rank":
			square = f"{get_square(value, piece_rank)}"
		else:
			square = f"{get_square(piece_file, value)}"

		print(square)

		starting_square_info = {
			"starting_square": start_square,
			"piece_type": board_placemeent[start_square]["piece_type"],
			"piece_color": board_placemeent[start_square]["piece_color"]
		}

		updated_FEN = update_FEN(board_placemeent, starting_square_info, square)
		king_position = get_king_position(updated_FEN, piece_color)
		king_in_check = False

		if is_king_in_check(updated_FEN, piece_color, king_position):
			king_in_check = True

		if f"{square}" in board_placemeent:
			if board_placemeent[f"{square}"]["piece_color"] == piece_color:
				break
			else:
				if not king_in_check:
					legal_squares.append(square)

				break

		if not king_in_check:
			legal_squares.append(square)
		
	return legal_squares

def get_legal_moves_in_direction(board_placement, start_square, directions, piece_color):
	legal_squares = []
	
	piece_file = get_file(start_square)
	piece_rank = get_row(start_square)

	for direction in directions:
		move_info = {
			"piece_color": piece_color,
			"starting_square": start_square
		}

		horizontal_directions = ["east", "west"]
		vertical_directions = ["north", "south"]

		piece_location = {
			"piece_file": piece_file,
			"piece_rank": piece_rank
		}

		if direction in horizontal_directions:
			legal_squares += get_legal_moves_in_straight_direction(board_placement, "rank", direction, move_info, piece_location)
		elif direction in vertical_directions:
			legal_squares += get_legal_moves_in_straight_direction(board_placement, "file", direction, move_info, piece_location)

		square_offset = None
		if direction in direction_offset_mapping:
			square_offset = direction_offset_mapping[direction]

		if square_offset:
			legal_squares += get_legal_moves_in_diagonal_direction(board_placement, move_info, piece_file, piece_rank, square_offset)

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

def get_king_legal_moves(board_placement, castling_rights, move_info):
	legal_moves = []

	starting_square = move_info["starting_square"]
	piece_color = move_info["piece_color"]

	left_square = f"{int(starting_square) + 1}"
	right_square = f"{int(starting_square) - 1}"
	up_square = f"{int(starting_square) + 8}"
	down_square = f"{int(starting_square) - 8}"
	up_left_square = f"{int(starting_square) + 7}"
	up_right_square = f"{int(starting_square) + 9}"
	down_left_square = f"{int(starting_square) - 7}"
	down_right_square = f"{int(starting_square) - 9}"

	white_king_starting_square = 4
	black_king_starting_square = 60

	castle_queenside_middle_square = f"{int(starting_square) - 1}"
	castle_queenside_square = f"{int(starting_square) - 2}"

	castle_kingside_middle_square = f"{int(starting_square) + 1}"
	castle_kingside_square = f"{int(starting_square) + 2}"

	can_castle_queenside = True
	can_castle_kingside = True

	king_position = int(get_king_position(board_placement, piece_color))

	if piece_color.lower() == "white":
		if king_position != white_king_starting_square:
			castling_rights[piece_color]["Kingside"] = False
			castling_rights[piece_color]["Queenside"] = False

			can_castle_kingside = False
			can_castle_queenside = False

	else:
		if king_position != black_king_starting_square:
			castling_rights[piece_color]["Kingside"] = False
			castling_rights[piece_color]["Queenside"] = False

			can_castle_kingside = False
			can_castle_queenside = False
	

	if castling_rights[piece_color]["Queenside"]:
		if castle_queenside_middle_square in board_placement:
			castling_rights[piece_color]["Queenside"] = False
			can_castle_queenside = False

		if castle_queenside_square in board_placement:
			castling_rights[piece_color]["Queenside"] = False
			can_castle_queenside = False

		if can_castle_queenside:
			legal_moves.append(castle_queenside_square)

	if castling_rights[piece_color]["Kingside"]:
		if castle_kingside_middle_square in board_placement:
			castling_rights[piece_color]["Kingside"] = False
			can_castle_kingside = False

		if castle_kingside_middle_square in board_placement:
			castling_rights[piece_color]["Kingside"] = False
			can_castle_kingside = False

		if can_castle_kingside:
			legal_moves.append(castle_kingside_square)

	legal_moves += [left_square, right_square, up_square, down_square, up_left_square, up_right_square, down_left_square, down_right_square]

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

		file_distance = get_file(f"{legal_move}") - get_file(starting_square)
		row_distance = get_row(f"{legal_move}") - get_row(starting_square)
		
		if abs(file_distance) > 1:
			if legal_move == castle_kingside_square or legal_move == castle_queenside_square:
				if abs(file_distance) <= 2:
					continue

			if legal_move in cleaned_legal_moves:
				cleaned_legal_moves.remove(f"{legal_move}")
				continue

		if abs(row_distance) > 1:
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