from django.db import models
from django.contrib.auth import get_user_model

from channels.db import database_sync_to_async

from .utils.fen_parser import parse_board_placement

def get_default_board_placement():
	initial_raw_board_placement = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
	parsed_board_placement = parse_board_placement(initial_raw_board_placement)

	return parsed_board_placement

def get_default_castling_rights():
	return {
		"White": {
			"Queenside": True,
			"Kingside": True
		},

		"Black": {
			"Queenside": True,
			"Kingside": True
		}
	}

class ChessGame(models.Model):
	white_player = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="white_player")
	black_player = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="black_player")
	
	game_status = models.CharField(max_length=50, default="Ongoing")
	game_result = models.CharField(max_length=50, default="Ongoing")

	current_move = models.IntegerField(default=1)
	current_player_turn = models.CharField(max_length=30, default="white")

	halfmove_clock = models.IntegerField(default=0) # 50 move rule detection

	white_player_clock = models.DecimalField(max_digits=6, decimal_places=1) # In seconds
	black_player_clock = models.DecimalField(max_digits=6, decimal_places=1) # In seconds

	captured_white_material = models.JSONField(default=dict)
	captured_black_material = models.JSONField(default=dict)

	parsed_board_placement = models.JSONField(default=get_default_board_placement)
	castling_rights = models.JSONField(default=get_default_castling_rights)
	en_passant_target_square = models.IntegerField(null=True, blank=True)

	@database_sync_to_async
	def get_full_parsed_fen(self):
		return {
			"board_placement": self.parsed_board_placement,
			"castling_rights": self.castling_rights,
			"en_passant_target_square": self.en_passant_target_square,
			"halfmove_clock": self.halfmove_clock,
			"fullmove_number": self.current_move
		}