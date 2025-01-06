from rest_framework.serializers import ModelSerializer

class UserSerializer(ModelSerializer):
	class Meta:
		fields = ["id", "username", "email", "password"]

	def create(self, validated_data):
		user_model =