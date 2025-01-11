from django.urls import path
from .views import ParseFENView, StartChessGameView

urlpatterns = [
	path("parse-fen/", ParseFENView.as_view(), name="parse_fen"),
	path("start-chess-game/", StartChessGameView.as_view(), name="start_chess_game")
]