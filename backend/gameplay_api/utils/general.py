import math

def get_row(square):
	return math.ceil((square + 1) / 8) - 1

def get_file(square):
	return square % 8

def get_square(file, rank):
	return (rank * 8) + file