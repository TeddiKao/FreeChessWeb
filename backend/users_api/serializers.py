from rest_framework.serializers import ModelSerializer
from django.contrib.auth import get_user_model

class UserSerializer(ModelSerializer):
	print("Initializing serializer")

	class Meta:
		model = get_user_model()
		fields = ["id", "username", "email", "password"]
		extra_kwargs = {
			"password": {
				"write_only": True
			}
		}

	def create(self, validated_data):
		print(validated_data)

		user_model = get_user_model()
		created_user = user_model.objects.create_user(**validated_data)

		return created_user