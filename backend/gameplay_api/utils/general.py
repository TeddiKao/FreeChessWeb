import math

def get_row(square):
	return math.ceil((int(square) + 1) / 8) - 1

def get_file(square):
	return int(square) % 8

def get_square(file, rank):
	return (rank * 8) + file

def is_square_on_edge(square):
	square_file = get_file(square)
	square_rank = get_row(square)

	edges = [0, 7]
	return square_file in edges or square_rank in edges

def is_on_same_diagonal(square1, square2):
	square1_file = get_file(square1)
	square1_rank = get_row(square1)

	square2_file = get_file(square2)
	square2_rank = get_row(square2)

	return abs(square1_file - square2_file) == abs(square1_rank - square2_rank)