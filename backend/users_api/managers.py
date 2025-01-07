from django.contrib.auth.base_user import BaseUserManager

class CustomUserManager(BaseUserManager):
	def create_user(self, username, email, password, **extra_fields):
		if not email:
			raise ValueError("Email must be set!")
		
		if not username:
			raise ValueError("Username must be set!")
		
		email = self.normalize_email(email)
		user = self.model(email=email, username=username, **extra_fields)
		user.set_password(password)
		user.save()

		print("User has been saved")
		return user