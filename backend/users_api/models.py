from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from .managers import CustomUserManager

# Create your models here.
class UserAuthModel(AbstractBaseUser):
	username = models.CharField(max_length=80)
	email = models.EmailField(max_length=80)

	email_verified = models.BooleanField()
	email_otp = models.CharField(max_length=6, null=True, blank=True)

	USERNAME_FIELD = email
	REQUIRED_FIELDS = [username, email]	

	objects = CustomUserManager()