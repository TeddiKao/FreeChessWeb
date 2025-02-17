import math

def get_row(square):
	return math.ceil((int(square) + 1) / 8) - 1

def get_file(square):
	return int(square) % 8

def get_square(file, rank):
	return (rank * 8) + file

def convert_to_algebraic_notation(square):
	files_list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
	square_file = get_file(square)
	square_rank = get_row(square)

	return f"{files_list[square_file]}{square_rank + 1}"