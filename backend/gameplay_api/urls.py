from django.urls import path
from .views import ParseFENView, StartChessGameView, ValidateMoveView

urlpatterns = [
	path("parse-fen/", ParseFENView.as_view(), name="parse_fen"),
	path("start-chess-game/", StartChessGameView.as_view(), name="start_chess_game"),
	path("validate-move/", ValidateMoveView.as_view(), name="validate_move")
]