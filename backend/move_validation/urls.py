from django.urls import path

from .views import ValidateMoveView, ShowLegalMoveView

urlpatterns = [
	path("validate-move/", ValidateMoveView.as_view(), name="validate_move"),
	path("show-legal-moves/", ShowLegalMoveView.as_view(), name="show_legal_moves"),
]