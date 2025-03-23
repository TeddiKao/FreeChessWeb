from typing import TypedDict
from move_validation_api.utils.general import *
from move_validation_api.utils.get_move_type import get_is_check, get_is_capture, get_is_castling, get_is_promotion
from .enums import PieceType
from .fen_parser import parse_board_placement

files_list = ["a", "b", "c", "d", "e", "f", "g", "h"]
piece_notation_mapping = {
    PieceType.ROOK.value: "r",
    PieceType.BISHOP.value: "b",
    PieceType.KNIGHT.value: "n",
    PieceType.KING.value: "k",
    PieceType.QUEEN.value: "q"
}


class MoveInfo(TypedDict):
    starting_square: str | int
    destination_square: str | int
    piece_type: str
    piece_color: str

def get_promotion_notation():
    pass

def get_capture_notation(board_placement, en_passant_target_square, move_info):
    is_capture = get_is_capture(board_placement, en_passant_target_square, move_info)

    if is_capture:
        return "x"
    else:
        return ""
    
def get_check_notation(board_placement, move_info):
    if get_is_check(board_placement, move_info):
        return "+"
    else:
        return ""
    
def get_promotion_notation(move_info):
    if get_is_promotion(move_info):
        promoted_piece_name = move_info["additional_info"]["promoted_piece"]
        promoted_piece_letter = piece_notation_mapping[promoted_piece_name].upper()

        return f"={promoted_piece_letter}"
    
    return ""

def handle_pawn_move(board_placement: dict, en_passant_square, move_info: MoveInfo):
    starting_square = move_info["starting_square"]
    destination_square = move_info["destination_square"]

    notated_square = convert_to_algebraic_notation(destination_square)
    starting_file_index = get_file(starting_square)

    capture_notation = get_capture_notation(board_placement, en_passant_square, move_info)
    check_notation = get_check_notation(board_placement, move_info)

    promotion_notation = get_promotion_notation(move_info)
 

    if capture_notation:
        starting_file = files_list[starting_file_index]

        return f"{starting_file}{capture_notation}{notated_square}{promotion_notation}{check_notation}"
    else:
        return f"{notated_square}{promotion_notation}{check_notation}"


def handle_piece_move(board_placement: dict, move_info: MoveInfo):
    starting_square = move_info["starting_square"]
    destination_square = move_info["destination_square"]
    piece_type = move_info["piece_type"]
    piece_notation = piece_notation_mapping[piece_type.lower()].upper()

    notated_square = convert_to_algebraic_notation(destination_square)
    capture_notation = "x" if get_is_capture(board_placement, None, move_info) else ""
    check_notation = "+" if get_is_check(board_placement, move_info) else ""
    
    full_notation = None
    if get_is_castling(move_info):
        starting_file = get_file(starting_square)
        destination_file = get_file(destination_square)

        if starting_file - destination_file == -2:
            full_notation = "O-O"
        else:
            full_notation = "O-O-O"

        return full_notation

    full_notation = f"{piece_notation}{capture_notation}{notated_square}{check_notation}"

    return full_notation


def get_algebraic_notation(board_placement: dict, en_passant_square, move_info: MoveInfo) -> str:
    piece_type = move_info["piece_type"].lower()

    if piece_type == PieceType.PAWN.value:
        return handle_pawn_move(board_placement, en_passant_square, move_info)

    else:
        return handle_piece_move(board_placement, move_info)