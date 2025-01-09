letter_to_piece_mapping = {
	"q": "Queen",
	"r": "Rook",
	"b": "Bishop",
	"n": "Knight",
	"k": "King",
}

def parse_board_placement(board_placement_string: str):
	for letter in board_placement_string:
		pass


def parse_fen(fen_string: str):
	fen_string_segments = fen_string.split(" ")
	if len(fen_string_segments) != 6:
		return "Invalid FEN!"
	
	board_placement_string = fen_string_segments[0]
	
	parsed_board_placement_string = parse_board_placement(board_placement_string)


	
parse_fen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")