from django.urls import path
from .views import *

urlpatterns = [
	path("parse-fen/", ParseFENView.as_view(), name="parse_fen"),
	path("start-chess-game/", StartChessGameView.as_view(), name="start_chess_game"),
	path("validate-move/", ValidateMoveView.as_view(), name="validate_move"),
	path("show-legal-moves/", ShowLegalMoveView.as_view(), name="show_legal_moves"),
	path("get-ongoing-chess-game/", GetOngoingGameView.as_view(), name="get_ongoing_chess_game"),
	path("get-is-checkmated/", GetIsCheckmatedView.as_view(), name="get_is_checkmated"),
]