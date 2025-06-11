from time import perf_counter

from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

from channels.db import database_sync_to_async

from .utils.fen_parser import parse_board_placement

from users.models import UserAuthModel

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
			"fullmove_number": 1,
			"side_to_move": "white",
		},

		"last_dragged_square": None,
		"last_dropped_square": None,
		"captured_material": {
			"white": get_default_captured_material_list(),
			"black": get_default_captured_material_list()
		},
		"promoted_pieces": {
			"white": get_default_promoted_pieces(),
			"black": get_default_promoted_pieces(),
		}
	}]

def get_default_captured_material_list():
	return {
		"queens": 0,
		"rooks": 0,
		"bishops": 0,
		"knights": 0,
		"pawns": 0,
	}

def get_default_promoted_pieces():
	return {
		"queens": 0,
		"rooks": 0,
		"bishops": 0,
		"knights": 0,
	}

class ChessGame(models.Model):
	white_player = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="white_player")
	black_player = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="black_player")
	played_at = models.DateTimeField(auto_now_add=True)

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

	captured_white_material = models.JSONField(default=get_default_captured_material_list)
	captured_black_material = models.JSONField(default=get_default_captured_material_list)
	promoted_white_pieces = models.JSONField(default=get_default_promoted_pieces, null=False, blank=False)
	promoted_black_pieces = models.JSONField(default=get_default_promoted_pieces, null=False, blank=False)

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
	def get_full_parsed_fen(self, exclude_fields = None):
		if not exclude_fields:
			exclude_fields = set()

		parsed_fen_field_map = {
			"board_placement": lambda: self.parsed_board_placement,
			"castling_rights": lambda: self.castling_rights,
			"en_passant_target_square": lambda: self.en_passant_target_square,
			"halfmove_clock": lambda: self.halfmove_clock,
			"fullmove_number": lambda: self.current_move,
			"side_to_move": lambda: self.current_player_turn
		}		

		fields = {}
		for fen_field, getter in parsed_fen_field_map.items():
			if fen_field not in exclude_fields:
				fields[fen_field] = getter()

		return fields
	
	@database_sync_to_async
	def async_end_game(self, game_result, game_end_cause, game_winner = None):
		self.game_status = "Ended"
		self.game_result = game_result
		self.game_winner = game_winner
		self.game_end_cause = game_end_cause
		self.save()

	@database_sync_to_async
	def get_player_of_color(self, color):
		if color.lower() == "white":
			return self.white_player
		else:
			return self.black_player
		
	def sync_get_player_color(self, player):
		if player == self.white_player:
			return "white"
		else:
			return "black"

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
	
	@database_sync_to_async
	def async_get_player_allowed_to_move(self):
		side_to_move = self.current_player_turn

		if side_to_move.lower() == "white":
			return self.white_player.username
		else:
			return self.black_player.username
		
	@classmethod
	def get_player_allowed_to_move(cls, white_player_username, black_player_username, side_to_move):
		if side_to_move == "white":
			return white_player_username
		else:
			return black_player_username

	def sync_get_player_allowed_to_move(self, white_player_username, black_player_username):
		side_to_move_fetch_start = perf_counter()
		side_to_move = self.current_player_turn
		side_to_move_fetch_end = perf_counter()
		print(f"Side to move fetch took {(side_to_move_fetch_end - side_to_move_fetch_start):.6f} seconds")

		if side_to_move == "white":
			return white_player_username
		else:
			return black_player_username
		
	@database_sync_to_async
	def refresh_game_from_db(self):
		self.refresh_from_db()
		
	@database_sync_to_async
	def async_get_player_allowed_to_move_from_id(self, game_id, white_player_username, black_player_username):
		game_data_fetch_start = perf_counter()
		game_data = ChessGame.objects.only("white_player", "black_player", "current_player_turn").get(id=game_id)
		game_data_fetch_end = perf_counter()
		print(f"Game data fetch took {(game_data_fetch_end - game_data_fetch_start):.6f} seconds")

		return game_data.sync_get_player_allowed_to_move(white_player_username, black_player_username)


	def sync_get_full_parsed_fen(self):
		return {
			"board_placement": self.parsed_board_placement,
            "castling_rights": self.castling_rights,
            "en_passant_target_square": self.en_passant_target_square,
            "halfmove_clock": self.halfmove_clock,
            "fullmove_number": self.current_move,
			"side_to_move": self.current_player_turn
		}
	
	@database_sync_to_async
	def async_get_game_attribute(self, attribute_name):
		return getattr(self, attribute_name)
	
	@database_sync_to_async
	def async_get_attributes(self, attribute_list):
		return ChessGame.objects.filter(id=self.id).values(*attribute_list).first()
	
	def sync_get_game_attribute(self, attribute_name):
		return getattr(self, attribute_name)
	
class UserGameplaySettings(models.Model):
	user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE)
	auto_queen = models.BooleanField(default=False, blank=False, null=False)
	show_legal_moves = models.BooleanField(default=True, blank=False, null=False)

class GameplayTimerTask(models.Model):
	game_room_id = models.CharField(null=False, blank=False, max_length=50)
	is_running = models.BooleanField(null=False, blank=False, default=False)

	@classmethod
	@database_sync_to_async
	def async_get_timer_task_from_room_id(cls, room_id):
		timer_task = cls.objects.filter(game_room_id=room_id).first()

		return timer_task
	
	@classmethod
	@database_sync_to_async
	def async_get_timer_exists_from_room_id(cls, room_id):
		timer_task = cls.objects.filter(game_room_id=room_id).first()

		return bool(timer_task)
		
	@classmethod
	@database_sync_to_async
	def async_create_timer(cls, game_room_id, is_timer_running = True):
		cls.objects.create(game_room_id=game_room_id, is_running=is_timer_running)
	
	def is_timer_running(self):
		return self.is_running
	
	@database_sync_to_async
	def async_start(self):
		self.is_running = True
		self.save()

	@database_sync_to_async
	def async_stop(self):
		self.is_running = False
		self.save()

class GameChallenge(models.Model):
	challenge_sender = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="challenge_sender")
	challenge_recepient = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="challenge_recepient")

	relationship = models.CharField(max_length=50, null=False, blank=False)
	challenge_base_time = models.IntegerField(null=False, blank=False)
	challenge_increment = models.IntegerField(null=False, blank=False)

	challenge_status = models.CharField(max_length=20, null=False, blank=False, default="pending")

	@classmethod
	@database_sync_to_async
	def async_create(cls, challenge_sender, challenge_recepient, relationship, challenge_time_control):
		cls.objects.create(
			challenge_sender=challenge_sender,
			challenge_recepient=challenge_recepient,
			relationship=relationship,
			challenge_base_time=challenge_time_control["baseTime"],
			challenge_increment=challenge_time_control["increment"]
		)

	@classmethod
	@database_sync_to_async
	def get_challenge_from_sender_username(self, sender_username):
		sender_user_model = UserAuthModel.sync_get_user_model_from_username(sender_username)

		return self.objects.filter(challenge_sender=sender_user_model).first()