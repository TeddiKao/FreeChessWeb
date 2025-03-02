from typing import TypedDict
from general import *
from move_type_detection import is_capture
from enums import PieceType
from fen_parser import parse_board_placement

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

    if is_capture(board_placement, move_info):
        return f"{file_letter}x{notated_square}"
    else:
        return notated_square

def handle_piece_move(move_info: MoveInfo):
    destination_square = move_info["destination_square"]
    piece_type = move_info["piece_type"]
    piece_notation = piece_notation_mapping[piece_type.lower()].upper()

    notated_square = convert_to_algebraic_notation(destination_square)

    return f"{piece_notation}{notated_square}"


def get_algebraic_notation(board_placement: dict, move_info: MoveInfo) -> str:
    piece_type = move_info["piece_type"].lower()

    if piece_type == PieceType.PAWN.value:
        return handle_pawn_move(board_placement, move_info)

    else:
        return handle_piece_move(move_info)
    
parsed_board_placement = parse_board_placement("rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR")
move_info = {
    "starting_square": 28,
    "destination_square": 35,
    "piece_type": "pawn",
    "piece_color": "white"
}

print(get_algebraic_notation(parsed_board_placement, move_info))