from move_validation.utils.general import convert_to_square_index

piece_letter_mapping = {
    "pawn": "p",
    "knight": "n",
    "bishop": "b",
    "rook": "r",
    "queen": "q",
    "king": "k"
}

def parse_regular_move(board_placement, universal_notation):
    starting_square_universal = universal_notation[:2]
    destination_square_universal = universal_notation[2:]
    
    starting_square_index = convert_to_square_index(starting_square_universal)
    destination_square_index = convert_to_square_index(destination_square_universal)
    
    piece_moved_info = board_placement.get(str(starting_square_index))
    piece_moved_type = piece_moved_info["piece_type"]
    piece_moved_color = piece_moved_info["piece_color"]

    structured_move_info = {
        "starting_square": str(starting_square_index),
        "destination_square": str(destination_square_index),
        "piece_type": piece_moved_type,
        "piece_color": piece_moved_color,

        "additional_info": {}
    }

    return structured_move_info

def parse_promotion_move(board_placement, universal_notation):
    promoted_piece_letter = universal_notation[-1]
    promoted_piece_name = piece_letter_mapping[promoted_piece_letter.lower()]

    starting_square_universal = universal_notation[:2]
    destination_square_universal = universal_notation[2:-1]
    starting_square_index = convert_to_square_index(starting_square_universal)
    destination_square_index = convert_to_square_index(destination_square_universal)

    piece_moved_info = board_placement.get(str(starting_square_index))
    piece_moved_type = piece_moved_info["piece_type"]
    piece_moved_color = piece_moved_info["piece_color"]

    structured_move_info = {
        "starting_square": str(starting_square_index),
        "destination_square": str(destination_square_index),
        "piece_type": piece_moved_type,
        "piece_color": piece_moved_color,

        "additional_info": {
            "promoted_piece": promoted_piece_name
        }
    }

    return structured_move_info


def parse_structured_move(board_placement, universal_notation: str):
    if universal_notation[-1].isdigit():
        return parse_regular_move(board_placement, universal_notation)
    else:
        return parse_promotion_move(board_placement, universal_notation)