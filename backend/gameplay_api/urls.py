from django.urls import path
from .views import ParseFENView

urlpatterns = [
	path("parse-fen/", ParseFENView.as_view(), name="parse_fen")
]