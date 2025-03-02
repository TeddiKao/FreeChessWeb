from typing import TypedDict
from move_validation_api.utils.general import *
from move_validation_api.utils.get_move_type import get_is_check, get_is_capture
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


def handle_pawn_move(board_placement: dict, move_info: MoveInfo):
    starting_square = move_info["starting_square"]
    destination_square = move_info["destination_square"]

    notated_square = convert_to_algebraic_notation(destination_square)
    starting_file = get_file(starting_square)
    file_letter = files_list[int(starting_file)]

    capture_notation = "x" if get_is_capture(board_placement, move_info) else ""
    check_notation = "+" if get_is_check(board_placement, move_info) else ""

    return f"{file_letter}{capture_notation}{notated_square}{check_notation}"


def handle_piece_move(board_placement: dict, move_info: MoveInfo):
    destination_square = move_info["destination_square"]
    piece_type = move_info["piece_type"]
    piece_notation = piece_notation_mapping[piece_type.lower()].upper()

    notated_square = convert_to_algebraic_notation(destination_square)
    capture_notation = "x" if get_is_capture(board_placement, move_info) else ""
    check_notation = "+" if get_is_check(board_placement, move_info) else ""

    full_notation = f"{piece_notation}{capture_notation}{notated_square}{check_notation}"

    return full_notation


def get_algebraic_notation(board_placement: dict, move_info: MoveInfo) -> str:
    piece_type = move_info["piece_type"].lower()

    if piece_type == PieceType.PAWN.value:
        return handle_pawn_move(board_placement, move_info)

    else:
        return handle_piece_move(board_placement, move_info)
    
parsed_board_placement = parse_board_placement("8/4p3/3p4/4b2p/p1Q2N2/1P2R3/6p1/6K1")
move_info = {
    "starting_square": 29,
    "destination_square": 14,
    "piece_type": "knight",
    "piece_color": "white"
}

print(get_algebraic_notation(parsed_board_placement, move_info))