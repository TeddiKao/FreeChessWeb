from move_validation.utils.general import convert_to_algebraic_notation

piece_letter_mapping = {
    "pawn": "p",
    "knight": "n",
    "bishop": "b",
    "rook": "r",
    "queen": "q",
    "king": "k",
}

castling_mapping = {
    "White": {
        "Kingside": "K",
        "Queenside": "Q"
    },

    "Black": {
        "Kingside": "k",
        "Queenside": "q",
    }
}

def parse_raw_board_placement(structured_board_placement):
    raw_board_placement = ""
    consecutive_empty_squares = 0

    starting_rank = 7

    for rank in range(starting_rank, -1, -1):
        starting_rank_square = 8 * rank
        ending_rank_square = 8 * (rank + 1) - 1

        

        for square in range(starting_rank_square, ending_rank_square + 1):
            square_info = structured_board_placement.get(str(square))

            if not square_info:
                consecutive_empty_squares += 1

                if (square + 1) % 8 != 0:
                    continue
                else:
                    raw_board_placement += str(consecutive_empty_squares)
                    consecutive_empty_squares = 0

                    if rank != 0:
                        raw_board_placement += "/"
                    
                    continue

            if consecutive_empty_squares > 0:
                raw_board_placement += str(consecutive_empty_squares)
                consecutive_empty_squares = 0

            piece_color = square_info["piece_color"]
            piece_type = square_info["piece_type"]
            piece_letter = piece_letter_mapping[piece_type.lower()]

            if piece_color.lower() == "white":
                raw_board_placement += piece_letter.upper()
            else:
                raw_board_placement += piece_letter.lower()

            if (square + 1) % 8 == 0 and rank != 0:
                raw_board_placement += "/"
            
    return raw_board_placement

def parse_raw_castling_rights(structured_castling_rights):
    raw_castling_rights_string = ""

    for side in structured_castling_rights["White"].keys():
        castle_letter = structured_castling_rights["White"][side]

        if not castle_letter:
            continue

        raw_castling_rights_string += castling_mapping["White"][side]

    for side in structured_castling_rights["Black"].keys():
        castle_letter = structured_castling_rights["Black"][side]

        if not castle_letter:
            continue

        raw_castling_rights_string += castling_mapping["Black"][side]

    return raw_castling_rights_string or "-"    

def parse_raw_side_to_move(structured_side_to_move):
    return structured_side_to_move[0].lower()

def parse_raw_en_passant_target_square(target_square_number) -> str:
    if target_square_number:
        return convert_to_algebraic_notation(target_square_number)
    else:
        return "-"

def parse_raw_fen(structured_fen):
    structured_board_placement = structured_fen["board_placement"]
    structured_castling_rights = structured_fen["castling_rights"]
    structured_side_to_move = structured_fen["side_to_move"]
    en_passant_target_square_number = structured_fen["en_passant_target_square"]
    
    halfmove_clock = structured_fen["halfmove_clock"]
    fullmove_number = structured_fen["fullmove_number"]

    raw_board_placement = parse_raw_board_placement(structured_board_placement) 
    raw_castling_rights = parse_raw_castling_rights(structured_castling_rights)
    raw_side_to_move = parse_raw_side_to_move(structured_side_to_move)
    raw_en_passant_target_square = parse_raw_en_passant_target_square(en_passant_target_square_number)

    full_raw_fen = f"{raw_board_placement} {raw_side_to_move} {raw_castling_rights} {raw_en_passant_target_square} {halfmove_clock} {fullmove_number}"

    return full_raw_fen
