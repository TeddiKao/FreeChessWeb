from django.urls import path, include

from .views import CreateUserView

urlpatterns = [
	path("create-user", CreateUserView.as_view(), name="create_user"),
	path()
]