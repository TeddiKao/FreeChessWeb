from django.urls import path
from .views import ParseFENView, StartChessGameView, ValidateMoveView, ShowLegalMoveView, GetIsKingInCheckView

urlpatterns = [
	path("parse-fen/", ParseFENView.as_view(), name="parse_fen"),
	path("start-chess-game/", StartChessGameView.as_view(), name="start_chess_game"),
	path("validate-move/", ValidateMoveView.as_view(), name="validate_move"),
	path("show-legal-moves/", ShowLegalMoveView.as_view(), name="show_legal_moves"),
	path("get-king-is-in-check/", GetIsKingInCheckView.as_view(), name="get_king_is_in_check")
]