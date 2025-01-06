from django.contrib.auth import get_user_model

from rest_framework import generics
from rest_framework.permissions import AllowAny

from .serializers import UserSerializer


# Create your views here.
class CreateUserView(generics.CreateAPIView):
	user = get_user_model()

	queryset = user.objects.all()
	serializer_class = UserSerializer
	permission_classes = [AllowAny]
