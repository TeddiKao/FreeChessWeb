from rest_framework.serializers import ModelSerializer
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

from .password_validators import MinimumLengthValidator, UppercaseLetterValidator, LowercaseLetterValidator, DigitValidator

def format_detected_error(detected_error: str):
	return detected_error[2:-2]

class UserSerializer(ModelSerializer):
	def validate(self, data):
		detected_errors = []
		provided_password = data.get("password")

		password_validators = [
			MinimumLengthValidator(min_length=8),
			LowercaseLetterValidator(),
			UppercaseLetterValidator(),
			DigitValidator()
		]

		for password_validator in password_validators:
			try:
				password_validator.validate(provided_password)
			except ValidationError as e:
				formatted_error = format_detected_error(str(e))
				detected_errors.append(formatted_error)

		if len(detected_errors) > 0:
			print(detected_errors)
			raise ValidationError(detected_errors)

		return data

	class Meta:
		model = get_user_model()
		fields = ["id", "username", "email", "password"]
		extra_kwargs = {
			"password": {
				"write_only": True
			}
		}

	def create(self, validated_data):
		user_model = get_user_model()
		created_user = user_model.objects.create_user(**validated_data)

		return created_user