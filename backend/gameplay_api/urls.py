from django.urls import path
from .views import *

urlpatterns = [
	path("parse-fen/", ParseFENView.as_view(), name="parse_fen"),
	path("get-gameplay-settings/", GetGameplaySettingsView.as_view(), name="get_gameplay_settings"),
	path("update-gameplay-settings/", UpdateSettingsView.as_view(), name="update_gameplay_settings"),
	path("get-current-position/", GetCurrentPositionView.as_view(), name="get_current_position"),
	
	path("get-player-timer/", GetPlayerTimerView.as_view(), name="get_player_timer"),
	path("get-position-list/", GetPositionListView.as_view(), name="get_position_list"),
	path("get-move-list/", GetMoveListView.as_view(), name="get_move_list"),
]