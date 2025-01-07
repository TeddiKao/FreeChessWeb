from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from .managers import CustomUserManager

# Create your models here.
class UserAuthModel(AbstractBaseUser):
	username = models.CharField(max_length=80, blank=False, unique=True)
	email = models.EmailField(blank=False, unique=True)

	email_verified = models.BooleanField(blank=True, default=False)
	email_otp = models.CharField(max_length=6, null=True, blank=True)

	USERNAME_FIELD = "email"

	objects = CustomUserManager()