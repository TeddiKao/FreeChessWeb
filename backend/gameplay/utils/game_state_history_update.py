import copy

from gameplay.utils.algebraic_notation_parser import get_algebraic_notation

def update_move_list(current_structured_fen, current_move_list, new_move_info):
    updated_move_list: list[list[str]] = copy.deepcopy(current_move_list)
    
    structured_board_placement = current_structured_fen["board_placement"]
    en_passant_target_square = current_structured_fen["en_passant_target_square"]

    algebraic_notation = get_algebraic_notation(structured_board_placement, en_passant_target_square, new_move_info)
    
    if len(updated_move_list[-1]) == 2:
        updated_move_list.append([algebraic_notation])
    else:
        updated_move_list[-1].append(algebraic_notation)


def update_position_list(current_position_list, new_move, new_position):
    pass