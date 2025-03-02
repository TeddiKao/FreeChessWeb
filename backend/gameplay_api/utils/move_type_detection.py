from typing import TypedDict

class MoveInfo(TypedDict):
    starting_square: str | int
    destination_square: str | int
    piece_type: str
    piece_color: str

def is_capture(board_placement: dict, move_info: MoveInfo):
	destination_square = move_info["destination_square"]
	if board_placement.get(str(destination_square)):
		return True

	return False