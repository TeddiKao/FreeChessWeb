import json
from general import get_file, get_row

def convert_to_algebraic_notation(square):
	files_list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
	square_file = get_file(square)
	square_rank = get_row(square)

	return f"{files_list[square_file]}{square_rank + 1}"

piece_letter_mapping = {
    "pawn": "p",
    "knight": "n",
    "bishop": "b",
    "rook": "r",
    "queen": "q",
    "king": "k"
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

        print(starting_rank_square, ending_rank_square)

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

    for color in structured_castling_rights.keys():
        for side in structured_castling_rights[color].keys():
            castle_letter = structured_castling_rights[color][side]

            if not castle_letter:
                continue

            raw_castling_rights_string += castling_mapping[color][side] 

    return raw_castling_rights_string or "-"    

def parse_raw_side_to_move(structured_side_to_move):
    return structured_side_to_move[0].lower()

def parse_raw_en_passant_target_square(target_square_number) -> str:
    return convert_to_algebraic_notation(target_square_number)

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

    full_raw_fen = f"{raw_board_placement} {raw_castling_rights} {raw_side_to_move} {raw_en_passant_target_square} {halfmove_clock} {fullmove_number}"

    return full_raw_fen

print(
    parse_raw_fen({
    "board_placement": {
        "0": {
            "piece_color": "White",
            "piece_type": "Rook",
            "starting_square": 0
        },
        "1": {
            "piece_color": "White",
            "piece_type": "Knight",
            "starting_square": 1
        },
        "2": {
            "piece_color": "White",
            "piece_type": "Bishop",
            "starting_square": 2
        },
        "3": {
            "piece_color": "White",
            "piece_type": "Queen",
            "starting_square": 3
        },
        "4": {
            "piece_color": "White",
            "piece_type": "King",
            "starting_square": 4
        },
        "5": {
            "piece_color": "White",
            "piece_type": "Bishop",
            "starting_square": 5
        },
        "6": {
            "piece_color": "White",
            "piece_type": "Knight",
            "starting_square": 6
        },
        "7": {
            "piece_color": "White",
            "piece_type": "Rook",
            "starting_square": 7
        },
        "8": {
            "piece_color": "White",
            "piece_type": "Pawn",
            "starting_square": 8
        },
        "9": {
            "piece_color": "White",
            "piece_type": "Pawn",
            "starting_square": 9
        },
        "10": {
            "piece_color": "White",
            "piece_type": "Pawn",
            "starting_square": 10
        },
        "11": {
            "piece_color": "White",
            "piece_type": "Pawn",
            "starting_square": 11
        },
        "13": {
            "piece_color": "White",
            "piece_type": "Pawn",
            "starting_square": 13
        },
        "14": {
            "piece_color": "White",
            "piece_type": "Pawn",
            "starting_square": 14
        },
        "15": {
            "piece_color": "White",
            "piece_type": "Pawn",
            "starting_square": 15
        },
        "28": {
            "piece_type": "Pawn",
            "piece_color": "White",
            "starting_square": 12
        },
        "48": {
            "piece_color": "Black",
            "piece_type": "Pawn",
            "starting_square": 48
        },
        "49": {
            "piece_color": "Black",
            "piece_type": "Pawn",
            "starting_square": 49
        },
        "50": {
            "piece_color": "Black",
            "piece_type": "Pawn",
            "starting_square": 50
        },
        "51": {
            "piece_color": "Black",
            "piece_type": "Pawn",
            "starting_square": 51
        },
        "52": {
            "piece_color": "Black",
            "piece_type": "Pawn",
            "starting_square": 52
        },
        "53": {
            "piece_color": "Black",
            "piece_type": "Pawn",
            "starting_square": 53
        },
        "54": {
            "piece_color": "Black",
            "piece_type": "Pawn",
            "starting_square": 54
        },
        "55": {
            "piece_color": "Black",
            "piece_type": "Pawn",
            "starting_square": 55
        },
        "56": {
            "piece_color": "Black",
            "piece_type": "Rook",
            "starting_square": 56
        },
        "57": {
            "piece_color": "Black",
            "piece_type": "Knight",
            "starting_square": 57
        },
        "58": {
            "piece_color": "Black",
            "piece_type": "Bishop",
            "starting_square": 58
        },
        "59": {
            "piece_color": "Black",
            "piece_type": "Queen",
            "starting_square": 59
        },
        "60": {
            "piece_color": "Black",
            "piece_type": "King",
            "starting_square": 60
        },
        "61": {
            "piece_color": "Black",
            "piece_type": "Bishop",
            "starting_square": 61
        },
        "62": {
            "piece_color": "Black",
            "piece_type": "Knight",
            "starting_square": 62
        },
        "63": {
            "piece_color": "Black",
            "piece_type": "Rook",
            "starting_square": 63
        }
    },
    "castling_rights": {
        "Black": {
            "Kingside": True,
            "Queenside": True
        },
        "White": {
            "Kingside": True,
            "Queenside": True
        }
    },
    "en_passant_target_square": 20,
    "halfmove_clock": 0,
    "fullmove_number": 1,
    "side_to_move": "black"
})
)
