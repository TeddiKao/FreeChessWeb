from django.urls import path
from .views import ProcessMoveView

urlpatterns = [
    path("process-move", ProcessMoveView.as_view(), name="process_move"),
]