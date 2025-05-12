import copy

from gameplay.utils.algebraic_notation_parser import get_algebraic_notation
from move_validation.utils.get_move_type import get_move_type

def update_move_list(current_structured_fen, current_move_list, new_move_info):
    updated_move_list: list[list[str]] = copy.deepcopy(current_move_list)
    
    structured_board_placement = current_structured_fen["board_placement"]
    en_passant_target_square = current_structured_fen["en_passant_target_square"]

    algebraic_notation = get_algebraic_notation(structured_board_placement, en_passant_target_square, new_move_info)
    
    if len(updated_move_list) > 0:
        if len(updated_move_list[-1]) == 2:
            updated_move_list.append([algebraic_notation])
        else:
            updated_move_list[-1].append(algebraic_notation)
    else:
        updated_move_list.append([algebraic_notation])

    return updated_move_list


def update_position_list(current_position_list, new_move_info, new_position):
    updated_position_list: list = copy.deepcopy(current_position_list)
    current_position = current_position_list[-1]["position"]

    current_structured_board_placement = current_position["board_placement"]
    current_en_passant_target_square = current_position["en_passant_target_square"]

    move_type = get_move_type(current_structured_board_placement, current_en_passant_target_square, new_move_info)
    starting_square = new_move_info["starting_square"]
    destination_square = new_move_info["destination_square"]
    
    updated_position_list.append({
        "position": new_position,
        "last_dragged_square": starting_square,
        "last_dropped_square": destination_square,
        "move_type": move_type,
        "move_info": new_move_info
    })

    return updated_position_list

