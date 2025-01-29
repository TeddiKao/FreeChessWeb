from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from django.conf import settings

from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser

from jwt import InvalidSignatureError, ExpiredSignatureError, DecodeError
from jwt import decode

User = get_user_model()

class JWTAuthenticationMiddleware:
	pass