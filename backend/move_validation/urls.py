from django.urls import path

from .views import ValidateMoveView, ShowLegalMoveView, GetIsCheckmatedView, GetIsStalematedView

urlpatterns = [
	path("validate-move/", ValidateMoveView.as_view(), name="validate_move"),
	path("show-legal-moves/", ShowLegalMoveView.as_view(), name="show_legal_moves"),
	path("get-is-checkmated/", GetIsCheckmatedView.as_view(), name="get_is_checkmated"),
	path("get-is-stalemated/", GetIsStalematedView.as_view(), name="get_is_stalemated")
]