piece_letter_mapping = {
    "pawn": "p",
    "knight": "n",
    "bishop": "b",
    "rook": "r",
    "queen": "q",
    "king": "k"
}

def parse_raw_board_placement(structured_board_placement):
    raw_board_placement = ""
    consecutive_empty_squares = 0

    starting_rank = 7

    for rank in range(starting_rank, -1, -1):
        starting_rank_square = 8 * rank
        ending_rank_square = 8 * (rank + 1) - 1

        print(starting_rank_square, ending_rank_square)

        for square in range(starting_rank_square, ending_rank_square + 1):
            square_info = structured_board_placement.get(str(square))

            if not square_info:
                consecutive_empty_squares += 1

                if (square + 1) % 8 != 0:
                    continue
                else:
                    raw_board_placement += str(consecutive_empty_squares)
                    consecutive_empty_squares = 0

                    if rank != 0:
                        raw_board_placement += "/"
                    
                    continue

            if consecutive_empty_squares > 0:
                raw_board_placement += str(consecutive_empty_squares)
                consecutive_empty_squares = 0

            piece_color = square_info["piece_color"]
            piece_type = square_info["piece_type"]
            piece_letter = piece_letter_mapping[piece_type.lower()]

            if piece_color.lower() == "white":
                raw_board_placement += piece_letter.upper()
            else:
                raw_board_placement += piece_letter.lower()

            if (square + 1) % 8 == 0:
                raw_board_placement += "/"
            
    return raw_board_placement

def parse_raw_fen(structured_fen):
    structured_board_placement = structured_fen["board_placement"]
    
    raw_board_placement = parse_raw_board_placement(structured_board_placement) 