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


def handle_pawn_move(board_placement: dict, en_passant_square, move_info: MoveInfo):
    starting_square = move_info["starting_square"]
    destination_square = move_info["destination_square"]

    notated_square = convert_to_algebraic_notation(destination_square)
    starting_file = get_file(starting_square)

    capture_notation = "x" if get_is_capture(board_placement, en_passant_square, move_info) else ""
    check_notation = "+" if get_is_check(board_placement, move_info) else ""

    return f"{capture_notation}{notated_square}{check_notation}"


def handle_piece_move(board_placement: dict, move_info: MoveInfo):
    destination_square = move_info["destination_square"]
    piece_type = move_info["piece_type"]
    piece_notation = piece_notation_mapping[piece_type.lower()].upper()

    notated_square = convert_to_algebraic_notation(destination_square)
    capture_notation = "x" if get_is_capture(board_placement, None, move_info) else ""
    check_notation = "+" if get_is_check(board_placement, move_info) else ""

    full_notation = f"{piece_notation}{capture_notation}{notated_square}{check_notation}"

    return full_notation


def get_algebraic_notation(board_placement: dict, en_passant_square, move_info: MoveInfo) -> str:
    piece_type = move_info["piece_type"].lower()

    if piece_type == PieceType.PAWN.value:
        return handle_pawn_move(board_placement, en_passant_square, move_info)

    else:
        return handle_piece_move(board_placement, move_info)