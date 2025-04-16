from uuid import uuid4

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

def get_default_position_list():
	return [{
		"position": {
			"board_placement": get_default_board_placement(),
			"castling_rights": get_default_castling_rights(),
			"en_passant_target_square": None,
			"halfmove_clock": 0,
			"fullmove_number": 1
		},

		"last_dragged_square": None,
		"last_dropped_square": None
	}]
	
class TimerTask(models.Model):
	timer_task_id = models.UUIDField(default=uuid4, unique=True, primary_key=True)
	status = models.CharField(max_length=20)


class ChessGame(models.Model):
	white_player = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="white_player")
	black_player = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="black_player")
	
	game_status = models.CharField(max_length=50, default="Ongoing")
	game_result = models.CharField(max_length=50, default="Ongoing")
	game_winner = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, blank=True, null=True)
	game_end_cause = models.CharField(max_length=50, null=True, blank=True)

	current_move = models.IntegerField(default=1)
	current_player_turn = models.CharField(max_length=5, default="white")

	halfmove_clock = models.IntegerField(default=0) # 50 move rule detection

	white_player_clock = models.DecimalField(max_digits=7, decimal_places=1) # In seconds
	black_player_clock = models.DecimalField(max_digits=7, decimal_places=1) # In seconds
	white_player_increment = models.IntegerField(blank=False, null=False, default=0)
	black_player_increment = models.IntegerField(blank=False, null=False, default=0)

	captured_white_material = models.JSONField(default=dict)
	captured_black_material = models.JSONField(default=dict)

	parsed_board_placement = models.JSONField(default=get_default_board_placement)
	castling_rights = models.JSONField(default=get_default_castling_rights)
	en_passant_target_square = models.IntegerField(null=True, blank=True)

	is_timer_running = models.BooleanField(default=False, null=False, blank=False)
	timer_initiator = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="timer_initiator", null=True, blank=True)

	position_list = models.JSONField(default=get_default_position_list, null=False, blank=False)
	move_list = models.JSONField(default=list, null=False, blank=False)

	def sync_get_position_list(self):
		return self.position_list
	
	def sync_get_move_list(self):
		return self.move_list

	@database_sync_to_async
	def get_full_parsed_fen(self):
		return {
			"board_placement": self.parsed_board_placement,
			"castling_rights": self.castling_rights,
			"en_passant_target_square": self.en_passant_target_square,
			"halfmove_clock": self.halfmove_clock,
			"fullmove_number": self.current_move
		}
	
	@database_sync_to_async
	def async_end_game(self, game_result):
		self.game_status = "Ended"
		self.game_result = game_result
		self.save()

	@database_sync_to_async
	def async_get_white_player_username(self):
		return self.white_player.username
	
	@database_sync_to_async
	def async_get_black_player_username(self):
		return self.black_player.username

	@database_sync_to_async
	def async_save(self):
		self.save()

	@database_sync_to_async
	def get_fen_from_game_id(self, game_id):
		game_data = ChessGame.objects.only("id", "parsed_board_placement", "castling_rights", "en_passant_target_square", "halfmove_clock", "current_move").get(id=game_id)
		return game_data.sync_get_full_parsed_fen()
	
	@database_sync_to_async
	def async_get_game_attribute_from_id(self, game_id, attr_name):
		attribute_data = ChessGame.objects.only(attr_name).get(id=game_id)
		
		return getattr(attribute_data, attr_name)

	def sync_get_full_parsed_fen(self):
		return {
			"board_placement": self.parsed_board_placement,
            "castling_rights": self.castling_rights,
            "en_passant_target_square": self.en_passant_target_square,
            "halfmove_clock": self.halfmove_clock,
            "fullmove_number": self.current_move
		}
	
	@database_sync_to_async
	def async_get_game_attribute(self, attribute_name):
		return getattr(self, attribute_name)
	
	def sync_get_game_attribute(self, attribute_name):
		return getattr(self, attribute_name)
	
class UserGameplaySettings(models.Model):
	user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE)
	auto_queen = models.BooleanField(default=False, blank=False, null=False)
	show_legal_moves = models.BooleanField(default=True, blank=False, null=False)
