import re

from django.core.exceptions import ValidationError

class MinimumLengthValidator:
	def __init__(self, min_length=8):
		self.min_length = min_length

	def validate(self, password, user=None):
		if len(password) < self.min_length:
			raise ValidationError(f"Password must be at least {self.min_length} characters long")

class UppercaseLetterValidator:
	def validate(self, password, user=None):
		if not re.search("[A-Z]", password):
			raise ValidationError("Password must have at least one uppercase letter")

class LowercaseLetterValidator:
	def validate(self, password, user=None):
		if not re.search("[a-z]", password):
			raise ValidationError("Password must have at least one lowercase letter")

class DigitValidator:
	def validate(self, password, user=None):
		if not re.search("[0-9]", password):
			raise ValidationError("Password must have at least one digit")

class CommonPasswordValidator:
	def validate(self, password, user=None):
		common_passwords = [
			"password123"
		]

		if password.lower() in common_passwords:
			raise ValidationError("Password is too common")