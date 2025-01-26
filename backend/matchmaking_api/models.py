from django.db import models
from django.contrib.auth import get_user_model

class WaitingPlayer(models.Model):
	user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE)
	is_available = models.BooleanField(default=False)
	timestamp = models.DateTimeField(auto_now_add=True)