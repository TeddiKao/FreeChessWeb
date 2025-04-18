from django.contrib.auth import get_user_model

from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from .serializers import UserSerializer

# Create your views here.
class CreateUserView(generics.CreateAPIView):
	user = get_user_model()

	queryset = user.objects.all()
	serializer_class = UserSerializer
	permission_classes = [AllowAny]

class GetUsernameView(APIView):
	def get(self, request):
		return Response(request.user.username)