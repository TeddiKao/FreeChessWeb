from django.contrib.auth.base_user import BaseUserManager

class CustomUserManager(BaseUserManager):
	def create_user(self, username, email, password, **extra_fields):
		if not email:
			raise ValueError("Email must be set!")