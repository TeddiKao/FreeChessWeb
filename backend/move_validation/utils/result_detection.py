from .get_legal_moves import is_king_in_check, get_legal_moves
from core.utils import compare_dictionaries

def get_is_stalemated(current_fen: dict, king_color: str) -> bool:
    board_placement = current_fen["board_placement"]
    castling_rights = current_fen["castling_rights"]
    en_passant_target_square = current_fen["en_passant_target_square"]

    all_legal_moves = []

    king_in_check = is_king_in_check(
        board_placement, king_color)
    
    if king_in_check:
        return False

    for square in board_placement.keys():
        piece_color: str = board_placement[square]["piece_color"]
        piece_type: str = board_placement[square]["piece_type"]

        if piece_color.lower() != king_color.lower():
            continue

        move_info = {
            "piece_color": piece_color,
            "piece_type": piece_type,
            "starting_square": square
        }

        all_legal_moves += get_legal_moves(
            move_info, board_placement, en_passant_target_square, castling_rights)

        if len(all_legal_moves) > 0:
            return False

    return True


def get_is_checkmated(current_fen: dict, king_color: str) -> bool:
    board_placement = current_fen["board_placement"]
    castling_rights: dict = current_fen["castling_rights"]
    en_passant_target_square: str = current_fen["en_passant_target_square"]

    all_legal_moves: list = []

    king_in_check: bool = is_king_in_check(
        board_placement, king_color)
    
    if not king_in_check:
        return False

    for square in board_placement.keys():
        piece_color: str = board_placement[square]["piece_color"]
        piece_type: str = board_placement[square]["piece_type"]

        if piece_color.lower() != king_color.lower():
            continue

        move_info: dict = {
            "piece_color": piece_color,
            "piece_type": piece_type,
            "starting_square": square
        }

        all_legal_moves += get_legal_moves(
            move_info, board_placement, en_passant_target_square, castling_rights)

        if len(all_legal_moves) > 0:
            return False

    return True

def get_position_occurences(position_list: list, position: dict):
    occurences = 0

    for position_list_data in position_list:
        position_list_fen = position_list_data["position"]

        position_list_board_placement = position_list_fen["board_placement"]
        position_list_castling_rights = position_list_fen["castling_rights"]
        position_list_en_passant = position_list_fen["en_passant_target_square"]

        position_to_check_board_placement = position["board_placement"]
        position_to_check_castling_rights = position["castling_rights"]
        position_to_check_en_passant = position["en_passant_target_square"]

        if compare_dictionaries(position_list_board_placement, position_to_check_board_placement):
            continue

        if compare_dictionaries(position_list_castling_rights, position_to_check_castling_rights):
            continue

        if compare_dictionaries(position_list_en_passant, position_to_check_en_passant):
            continue

        occurences += 1

    return occurences

def is_threefold_repetiiton(position_list: list, position: dict):
    position_occurences = get_position_occurences(position_list, position)
    print(position_occurences)

    return position_occurences >= 3