from move_validation.utils.general import convert_to_square_index

def parse_structured_move(structured_fen, universal_notation):
    board_placement = structured_fen["board_placement"]
    en_passant_target_square = structured_fen["en_passant_target_square"]
    
    starting_square_universal = universal_notation[:2]
    destination_square_universal = universal_notation[2:]
    starting_square_index = convert_to_square_index(starting_square_universal)
    destination_square_index = convert_to_square_index(destination_square_universal)

