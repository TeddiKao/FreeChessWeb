from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth import get_user_model
from .managers import CustomUserManager

from channels.db import database_sync_to_async

class UserAuthModel(AbstractBaseUser):
	username = models.CharField(max_length=80, blank=False, unique=True)
	email = models.EmailField(blank=False, unique=True)

	email_verified = models.BooleanField(blank=True, default=False)
	email_otp = models.CharField(max_length=6, null=True, blank=True)

	USERNAME_FIELD = "email"

	objects = CustomUserManager()

	@database_sync_to_async	
	def async_get_player_username(self):
		return self.username
	
	@database_sync_to_async
	def async_get_player_id(self):
		return self.pk
	
	def sync_get_player_username(self):
		return self.username
	
	def sync_get_player_id(self):
		return self.pk

class UserProfile(models.Model):
	user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE)
	is_online = models.BooleanField(default=False)
	is_matchmaking = models.BooleanField(default=False)
