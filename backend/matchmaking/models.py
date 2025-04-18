from django.db import models
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async

class WaitingPlayer(models.Model):
	user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE, related_name="linked_user")
	matched_user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE, related_name="matched_user", null=True, blank=True)
	timestamp = models.DateTimeField(auto_now_add=True)
	base_time = models.IntegerField(null=False, blank=False, default=models.NOT_PROVIDED)
	increment_time = models.IntegerField(null=False, blank=False, default=models.NOT_PROVIDED)

	@database_sync_to_async
	def get_username(self):
		return self.user.username