from time import perf_counter

from .general import *
from .legal_move_helpers import *
from .get_legal_moves import *


def validate_move(current_fen, move_info):
    info_fetch_time_start = perf_counter()
    board_placement = current_fen["board_placement"]
    castling_rights = current_fen["castling_rights"]
    en_passant_target_square = current_fen["en_passant_target_square"]

    piece_type = move_info["piece_type"].lower()

    destination_square = move_info["destination_square"]
    sliding_pieces = ["queen", "rook", "bishop"]

    move_is_valid = True

    info_fetch_time_end = perf_counter()
    info_fetch_time = info_fetch_time_end - info_fetch_time_start
    

    legal_move_generation_start = perf_counter()

    if piece_type in sliding_pieces:
        legal_moves = get_sliding_piece_legal_moves(board_placement, move_info)
        legal_move_generation_end = perf_counter()
        legal_move_generation_time = legal_move_generation_end - legal_move_generation_start
        

        move_is_valid_checking_start = perf_counter()
        move_is_valid = destination_square in legal_moves
        move_is_valid_checking_end = perf_counter()
        move_is_valid_checking_time = move_is_valid_checking_end - move_is_valid_checking_start
        

    elif piece_type == "pawn":
        legal_moves = get_pawn_legal_moves(
            board_placement, en_passant_target_square, move_info)
        legal_move_generation_end = perf_counter()
        legal_move_generation_time = legal_move_generation_end - legal_move_generation_start
        

        move_is_valid_checking_start = perf_counter()
        move_is_valid = destination_square in legal_moves
        move_is_valid_checking_end = perf_counter()
        move_is_valid_checking_time = move_is_valid_checking_end - move_is_valid_checking_start
        

    elif piece_type == "king":
        legal_moves = get_king_legal_moves(
            board_placement, castling_rights, move_info)
        legal_move_generation_end = perf_counter()
        legal_move_generation_time = legal_move_generation_end - legal_move_generation_start
        

        move_is_valid_checking_start = perf_counter()
        move_is_valid = destination_square in legal_moves
        move_is_valid_checking_end = perf_counter()
        move_is_valid_checking_time = move_is_valid_checking_end - move_is_valid_checking_start
        

    elif piece_type == "knight":
        legal_moves = get_knight_legal_moves(board_placement, move_info)
        legal_move_generation_end = perf_counter()
        legal_move_generation_time = legal_move_generation_end - legal_move_generation_start
        

        move_is_valid_checking_start = perf_counter()
        move_is_valid = destination_square in legal_moves
        move_is_valid_checking_end = perf_counter()
        move_is_valid_checking_time = move_is_valid_checking_end - move_is_valid_checking_start
        

    return move_is_valid

