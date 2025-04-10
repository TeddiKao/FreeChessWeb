letter_to_piece_mapping = {
	"q": "Queen",
	"r": "Rook",
	"b": "Bishop",
	"n": "Knight",
	"k": "King",
	"p": "Pawn"
}

def parse_board_placement(board_placement_string: str):
	current_rank = 7
	current_file = 0

	piece_placements = {}

	for character in board_placement_string:
		current_square = (current_rank * 8) + current_file
		
		if character.isalpha() and character != "/":
			piece_color = "White" if character.isupper() else "Black"
			piece_type = letter_to_piece_mapping[character.lower()]

			piece_placements[f"{current_square}"] = {
				"piece_color": piece_color,
				"piece_type": piece_type,
				"starting_square": current_square
			}

			if current_file < 7:
				current_file += 1

		elif character.isdigit():
			current_file += int(character)

		elif character == "/":
			current_file = 0
			current_rank -= 1

	return piece_placements

def parse_side_to_move(side_to_move):
	return "White" if side_to_move == "w" else "Black"

def parse_castling_rights(castling_rights: str):
	castling_rights_info = {
		"Black": {
			"Kingside": False,
			"Queenside": False,
		},

		"White": {
			"Kingside": False,
			"Queenside": False,
		}
	}

	for character in castling_rights:
		color = "Black" if character.islower() else "White"
		side = "Queenside" if character.lower() == "q" else "Kingside"

		castling_rights_info[color][side] = True

	return castling_rights_info

def parse_en_passant_target_square(target_square: str):
	files = ["a", "b", "c", "d", "e", "f", "g", "h"]

	if len(target_square) != 2 and target_square != "-":
		return "Invalid FEN!"

	if target_square != "-":
		current_char_index = 0
		file = None
		rank = None

		for character in target_square:
			if current_char_index == 0 and character not in files:
				return "Invalid FEN!"

			if current_char_index == 0:
				file = character
			else:
				rank = character

			current_char_index += 1

		square_index = None
		if rank % 2 == 0:
			square_index = (rank * 8) - (files.index(file) + 1)
		else:
			square_index = (rank * (rank - 1)) + (files.index(file) + 1)

		return square_index

	else:
		return None

def parse_fen(fen_string: str):
	fen_string_segments = fen_string.split(" ")
	if len(fen_string_segments) != 6:
		return "Invalid FEN!"
	
	board_placement_string = fen_string_segments[0]
	side_to_move = fen_string_segments[1]
	castling_rights = fen_string_segments[2]
	en_passant_target_square = fen_string_segments[3]
	halfmove_clock = fen_string_segments[4]
	fullmove_number = fen_string_segments[5]
	
	parsed_board_placement_string = parse_board_placement(board_placement_string)
	parsed_side_to_move = parse_side_to_move(side_to_move)
	parsed_castling_rights = parse_castling_rights(castling_rights)
	parsed_en_passant_target_square = parse_en_passant_target_square(en_passant_target_square)

	return {
		"board_placement": parsed_board_placement_string,
		"side_to_move": parsed_side_to_move,
		"castling_rights": parsed_castling_rights,
		"en_passant_target_square": parsed_en_passant_target_square,
		"halfmove_clock": int(halfmove_clock),
		"fullmove_number": int(fullmove_number)
	}