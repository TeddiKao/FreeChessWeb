from django.db import models
from django.contrib.auth import get_user_model

class Player(models.Model):
	user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE)
	is_searching = models.BooleanField(default=False)
	is_online = models.BooleanField(default=False)

class Queue(models.Model):
	players = models.JSONField(default=list)
