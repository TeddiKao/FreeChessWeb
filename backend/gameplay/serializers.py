from .models import ChessGame
from .models import UserGameplaySettings

from django.db.models import Q

from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

class ChessGameSerializer(ModelSerializer):
	def validate(self, data):
		user = self.context["request"].user

		white_player_filter = Q(white_player=user)
		black_player_filter = Q(black_player=user)
		ongoing_game_filter = Q(game_status="Ongoing")

		ongoing_chess_games = ChessGame.objects.filter((white_player_filter | black_player_filter) & ongoing_game_filter).count()
		if ongoing_chess_games >= 1:
			raise serializers.ValidationError("You already have an ongoing game")
		
	class Meta:
		model = ChessGame
		fields = "__all__"

class GameplaySettingsSerializer(ModelSerializer):
	class Meta:
		model = UserGameplaySettings
		fields = "__all__"