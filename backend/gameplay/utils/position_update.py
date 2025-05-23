import copy

from move_validation.utils.general import get_file, get_row, get_opposite_color
from move_validation.utils.get_move_type import get_is_capture

def update_castling_rights(structured_castling_rights, castling_side: str, color: str, new_value: str = False):
	structured_castling_rights[color.capitalize()][castling_side.capitalize()] = new_value

	return structured_castling_rights

def update_halfmove_clock(structured_fen, move_info):
	updated_structured_fen = copy.deepcopy(structured_fen)

	board_placement = structured_fen["board_placement"]
	en_passant_target_square = structured_fen["en_passant_target_square"]
	
	piece_type = move_info["piece_type"]

	if get_is_capture(board_placement, en_passant_target_square, move_info):
		updated_structured_fen["halfmove_clock"] = 0
		return 0
	
	if piece_type.lower() == "pawn":
		return 0
	
	return updated_structured_fen["halfmove_clock"] + 1

def handle_castling(structured_board_placement, move_info):
	starting_square = move_info["starting_square"]
	destination_square = move_info["destination_square"]
	piece_color: str = move_info["piece_color"]
	piece_type: str = move_info["piece_type"]

	kingside_castling_squares = [6, 62]
	queenside_castling_squares = [2, 58]

	if int(destination_square) in kingside_castling_squares:
		original_kingside_rook_square = int(destination_square) + 1
		castled_kingside_rook_square = int(destination_square) - 1

		del structured_board_placement[str(original_kingside_rook_square)]

		structured_board_placement[str(castled_kingside_rook_square)] = {
			"piece_type": "Rook",
			"piece_color": piece_color,
			"starting_square": str(castled_kingside_rook_square)
		}

	elif int(destination_square) in queenside_castling_squares:
		original_kingside_rook_square = int(destination_square) - 2
		castled_kingside_rook_square = int(destination_square) + 1

		del structured_board_placement[str(original_kingside_rook_square)]

		structured_board_placement[str(castled_kingside_rook_square)] = {
			"piece_type": "Rook",
			"piece_color": piece_color,
			"starting_square": str(original_kingside_rook_square)
		}

	return structured_board_placement

def handle_pawn_promotion(structured_board_placement, move_info):
	destination_square = move_info["destination_square"]
	initial_square = move_info["initial_square"] if "initial_square" in move_info.keys(
	) else None

	piece_color: str = move_info["piece_color"]
	additional_info: dict = move_info["additional_info"]

	new_board_placement = copy.deepcopy(structured_board_placement)

	promoted_piece = additional_info["promoted_piece"]

	new_board_placement[str(destination_square)] = {
		"piece_type": promoted_piece,
		"piece_color": piece_color,
		"starting_square": initial_square
	}

	return new_board_placement

def update_structured_fen(structured_fen, move_info):
	structured_fen_before_move = copy.deepcopy(structured_fen)
	structured_fen = copy.deepcopy(structured_fen)

	try:
		updated_board_placement = copy.deepcopy(structured_fen["board_placement"])
		updated_castling_rights = copy.deepcopy(structured_fen["castling_rights"])

		starting_square = move_info["starting_square"]
		destination_square = move_info["destination_square"]
		piece_color: str = move_info["piece_color"]
		piece_type: str = move_info["piece_type"]
		initial_square = move_info.get("initial_square") or None

		addtional_info: dict = move_info.get("additional_info") or {}

		starting_file = get_file(starting_square)
		starting_rank = get_row(starting_square)
		destination_file = get_file(destination_square)
		destination_rank = get_row(destination_square)

		del updated_board_placement[str(starting_square)]

		if piece_type.lower() == "king":
			if abs(starting_file - destination_file) == 2:
				updated_board_placement = handle_castling(updated_board_placement, move_info)

			updated_castling_rights = update_castling_rights(updated_castling_rights, "Kingside", piece_color)
			updated_castling_rights = update_castling_rights(updated_castling_rights, "Kingside", piece_color)

		elif piece_type.lower() == "rook":
			kingside_rook_starting_squares = [7, 63]

			castling_side = "Kingside" if initial_square in kingside_rook_starting_squares else "Queenside"
			updated_castling_rights = update_castling_rights(updated_castling_rights, castling_side, piece_color)

		if not "promoted_piece" in addtional_info.keys():
			updated_board_placement[str(destination_square)] = {
				"piece_type": piece_type,
				"piece_color": piece_color,
				"starting_square": initial_square
			}

			if structured_fen["en_passant_target_square"] and piece_type.lower() == "pawn":
				if int(destination_square) == int(structured_fen["en_passant_target_square"]):
					captured_pawn_offset = -8 if piece_color.lower() == "white" else 8
					captured_pawn_square = int(
							destination_square) + captured_pawn_offset
					
					del updated_board_placement[str(captured_pawn_square)]

		else:
			promoted_piece = addtional_info["promoted_piece"]

			updated_board_placement[str(destination_square)] = {
				"piece_type": promoted_piece,
				"piece_color": piece_color,
				"starting_square": initial_square
			}

		if piece_type.lower() != "pawn" or abs(starting_rank - destination_rank) != 2:
			structured_fen["en_passant_target_square"] = None
		else:
			target_square_offset = -8 if piece_color.lower() == "white" else 8
			structured_fen["en_passant_target_square"] = int(destination_square) + target_square_offset

		structured_fen["board_placement"] = updated_board_placement
		structured_fen["castling_rights"] = updated_castling_rights

		structured_fen["halfmove_clock"] = update_halfmove_clock(structured_fen_before_move, move_info)
		structured_fen["side_to_move"] = get_opposite_color(piece_color.lower())

		return structured_fen
	except Exception as e:
		print(e)