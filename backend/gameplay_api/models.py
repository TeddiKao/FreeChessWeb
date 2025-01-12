from django.db import models
from django.contrib.auth import get_user_model

class ChessGame(models.Model):
	white_player = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="white_player")
	black_player = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="black_player")
	
	game_status = models.CharField(max_length=50)
	game_result = models.CharField(max_length=50)

	current_move = models.IntegerField()
	current_player_turn = models.CharField(max_length=30)

	halfmove_clock = models.IntegerField() # 50 move rule detection

	white_player_clock = models.DecimalField() # In seconds
	black_player_clock = models.DecimalField() # In seconds

	captured_white_material = models.JSONField(default=dict)
	captured_black_material = models.JSONField(default=dict)

	current_position = models.CharField(max_length=92)