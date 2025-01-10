from .models import ChessGame

from rest_framework.serializers import ModelSerializer

class ChessGameSerializer(ModelSerializer):
	class Meta:
		model = ChessGame
		fields = "__all__"