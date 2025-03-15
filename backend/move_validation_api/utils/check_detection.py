from .general import *

orthogonal_moving_pieces = ["queen", "rook"]
diagonal_moving_pieces = ["queen", "bishop"]

KNIGHT_MOVEMENTS = [
    +6,
    +10,
    +15,
    +17,
    -6,
    -10,
    -15,
    -17,
]


def is_checked_north(board_placement: dict, king_color: str):
    king_position = get_king_position(board_placement, king_color)

    king_file = get_file(king_position)
    king_rank = get_row(king_position)

    for rank in range(king_rank + 1, 8):
        square = str(get_square(king_file, rank))
        if square in board_placement.keys():
            piece_color = board_placement[square]["piece_color"]
            piece_type = board_placement[square]["piece_type"]

            check_for_king = rank == king_rank + 1
            if check_for_king:
                if piece_type.lower() == "king" and piece_color.lower() != king_color.lower():
                    return True

            if piece_type.lower() in orthogonal_moving_pieces:
                if piece_color.lower() != king_color.lower():
                    return True

            break


def is_checked_south(board_placement: dict, king_color: str):
    king_position = get_king_position(board_placement, king_color)
    king_file = get_file(king_position)
    king_rank = get_row(king_position)

    for rank in range(king_rank - 1, -1, -1):
        square = str(get_square(king_file, rank))
        if square in board_placement.keys():
            piece_color = board_placement[square]["piece_color"]
            piece_type = board_placement[square]["piece_type"]

            check_for_king = rank == king_rank - 1
            if check_for_king:
                if piece_type.lower() == "king" and piece_color.lower() != king_color.lower():
                    return True

            if piece_type.lower() in orthogonal_moving_pieces:
                if piece_color.lower() != king_color.lower():
                    return True

            break


def is_checked_east(board_placement: dict, king_color: str):
    king_position = get_king_position(board_placement, king_color)
    king_file = get_file(king_position)
    king_rank = get_row(king_position)

    for file in range(king_file + 1, 8):
        square = str(get_square(file, king_rank))
        if square in board_placement.keys():
            piece_color = board_placement[square]["piece_color"]
            piece_type = board_placement[square]["piece_type"]

            check_for_king = file == king_file + 1
            if check_for_king:
                if piece_type.lower() == "king" and piece_color.lower() != king_color.lower():
                    return True

            if piece_type.lower() in orthogonal_moving_pieces:
                if piece_color.lower() != king_color.lower():
                    return True

            break


def is_checked_west(board_placement: dict, king_color: str):
    king_position = get_king_position(board_placement, king_color)
    king_file = get_file(king_position)
    king_rank = get_row(king_position)

    for file in range(king_file - 1, -1, -1):
        square = str(get_square(file, king_rank))
        if square in board_placement.keys():
            piece_color = board_placement[square]["piece_color"]
            piece_type = board_placement[square]["piece_type"]

            check_for_king = file == king_file - 1
            if check_for_king:
                if piece_type.lower() == "king" and piece_color.lower() != king_color.lower():
                    return True

            if piece_type.lower() in orthogonal_moving_pieces:
                if piece_color.lower() != king_color.lower():
                    return True

            break


def is_checked_northwest(board_placement: dict, king_color):
    king_position = get_king_position(board_placement, king_color)
    current_checking_square = int(king_position) + 7

    should_check_for_pawn = True
    should_check_for_king = True

    while is_square_on_board(current_checking_square):

        if str(current_checking_square) in board_placement.keys() and str(current_checking_square) != str(king_position):
            piece_color = board_placement[str(
                current_checking_square)]["piece_color"]
            piece_type = board_placement[str(
                current_checking_square)]["piece_type"]

            if should_check_for_pawn and piece_type.lower() == "pawn":
                if piece_color.lower() != king_color.lower() and piece_color.lower() == "black":
                    return True

            if should_check_for_king and piece_type.lower() == "king":
                if piece_color.lower() != king_color.lower():
                    return True

            if piece_type.lower() in diagonal_moving_pieces:
                if piece_color.lower() != king_color.lower():
                    return True

            break

        should_check_for_pawn = False
        should_check_for_king = False

        if is_square_on_edge(current_checking_square):
            break

        current_checking_square += 7


def is_checked_northeast(board_placement: dict, king_color):
    king_position = get_king_position(board_placement, king_color)
    current_checking_square = int(king_position) + 9

    should_check_for_pawn = True
    should_check_for_king = True

    while is_square_on_board(current_checking_square):

        if str(current_checking_square) in board_placement.keys() and str(current_checking_square) != str(king_position):
            piece_color = board_placement[str(
                current_checking_square)]["piece_color"]
            piece_type = board_placement[str(
                current_checking_square)]["piece_type"]

            if should_check_for_pawn and piece_type.lower() == "pawn":
                if piece_color.lower() != king_color.lower() and piece_color.lower() == "black":
                    return True

            if should_check_for_king and piece_type.lower() == "king":
                if piece_color.lower() != king_color.lower():
                    return True

            if piece_type.lower() in diagonal_moving_pieces:
                if piece_color.lower() != king_color.lower():
                    return True

            break

        should_check_for_pawn = False
        should_check_for_king = False

        if is_square_on_edge(current_checking_square):
            break

        current_checking_square += 9


def is_checked_southwest(board_placement: dict, king_color):
    king_position = get_king_position(board_placement, king_color)
    current_checking_square = int(king_position) - 9

    should_check_for_pawn = True
    should_check_for_king = True

    while is_square_on_board(current_checking_square):

        if str(current_checking_square) in board_placement.keys() and str(current_checking_square) != str(king_position):
            piece_color = board_placement[str(
                current_checking_square)]["piece_color"]
            piece_type = board_placement[str(
                current_checking_square)]["piece_type"]

            if should_check_for_pawn and piece_type.lower() == "pawn":
                if piece_color.lower() != king_color.lower() and piece_color.lower() == "white":
                    return True

            if should_check_for_king and piece_type.lower() == "king":
                if piece_color.lower() != king_color.lower():
                    return True

            if piece_type.lower() in diagonal_moving_pieces:
                if piece_color.lower() != king_color.lower():
                    return True

            break

        should_check_for_pawn = False
        should_check_for_king = False

        if is_square_on_edge(current_checking_square):
            break

        current_checking_square -= 9


def is_checked_southeast(board_placement: dict, king_color: dict):
    king_position = get_king_position(board_placement, king_color)
    current_checking_square = int(king_position) - 7

    should_check_for_pawn = True
    should_check_for_king = True

    while is_square_on_board(current_checking_square):

        if str(current_checking_square) in board_placement.keys() and str(current_checking_square) != str(king_position):
            piece_color = board_placement[str(
                current_checking_square)]["piece_color"]
            piece_type = board_placement[str(
                current_checking_square)]["piece_type"]

            if should_check_for_pawn and piece_type.lower() == "pawn":
                if piece_color.lower() != king_color.lower() and piece_color.lower() == "white":
                    return True

            if should_check_for_king and piece_type.lower() == "king":
                if piece_color.lower() != king_color.lower():
                    return True

            if piece_type.lower() in diagonal_moving_pieces:
                if piece_color.lower() != king_color.lower():
                    return True

            break

        should_check_for_pawn = False
        should_check_for_king = False

        if is_square_on_edge(current_checking_square):
            break

        current_checking_square -= 7


def is_checked_by_knight(board_placement: dict, king_color: str):
    king_position = get_king_position(board_placement, king_color)
    for knight_movement in KNIGHT_MOVEMENTS:
        new_position = int(king_position) + knight_movement
        file_difference = get_file(king_position) - get_file(new_position)
        rank_difference = get_row(king_position) - get_row(new_position)

        if abs(file_difference) > 2 or abs(rank_difference) > 2:
            continue

        if str(new_position) in board_placement.keys():
            piece_color = board_placement[str(new_position)]["piece_color"]
            piece_type = board_placement[str(new_position)]["piece_type"]

            if piece_type.lower() == "knight":
                if piece_color.lower() != king_color.lower():
                    return True

            continue


def is_checked_orthogonally(board_placement: dict, king_color: str):

    if is_checked_north(board_placement, king_color):
        return True

    if is_checked_south(board_placement, king_color):
        return True

    if is_checked_east(board_placement, king_color):
        return True

    if is_checked_west(board_placement, king_color):
        return True


def is_checked_diagonally(board_placement: dict, king_color: str):
    if is_checked_northwest(board_placement, king_color):
        return True

    if is_checked_northeast(board_placement, king_color):
        return True

    if is_checked_southwest(board_placement, king_color):
        return True

    if is_checked_southeast(board_placement, king_color):
        return True


def is_king_in_check(board_placement, king_color) -> bool:
    if is_checked_orthogonally(board_placement, king_color):
        return True

    if is_checked_diagonally(board_placement, king_color):
        return True

    if is_checked_by_knight(board_placement, king_color):
        return True

    return False
