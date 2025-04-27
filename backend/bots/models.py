from django.contrib.auth import get_user_model
from django.db import models

class BotGame(models.Model):
    human_player = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    bot = models.CharField(max_length=150, null=False, blank=False)

    structured_board_placement = models.JSONField(null=False, blank=False)