from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import CreateUserView

urlpatterns = [
	path("create-user/", CreateUserView.as_view(), name="create_user"),
	path("token/get/", TokenObtainPairView.as_view(), name="get_token"),
	path("token/refresh/", TokenRefreshView.as_view(), name="refresh_token") 
]