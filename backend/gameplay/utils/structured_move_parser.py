from move_validation.utils.general import convert_to_square_index

def parse_structured_move(board_placement, universal_notation):
    starting_square_universal = universal_notation[:2]
    destination_square_universal = universal_notation[2:]
    
    starting_square_index = convert_to_square_index(starting_square_universal)
    destination_square_index = convert_to_square_index(destination_square_universal)
    
    piece_moved_info = board_placement.get(str(starting_square_index))
    piece_moved_type = piece_moved_info["piece_type"]
    piece_moved_color = piece_moved_info["piece_color"]

    return {
        "starting_square": starting_square_index,
        "destination_square": destination_square_index,
        "piece_type": piece_moved_type,
        "piece_color": piece_moved_color
    }