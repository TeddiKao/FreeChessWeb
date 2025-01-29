from urllib.parse import parse_qs

from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist

from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser

from channels.db import database_sync_to_async

import jwt
from jwt import InvalidSignatureError, ExpiredSignatureError, DecodeError, InvalidTokenError

User = get_user_model()

@database_sync_to_async
def get_authenticated_user(user_id):
	user_model = get_user_model()

	try:
		authenticated_user = user_model.objects.get(id=user_id)
	except ObjectDoesNotExist:
		return AnonymousUser()
	
	return authenticated_user

class JWTAuthenticationMiddleware:
	def __init__(self, inner):
		self.inner = inner

	async def send_unauthorized_message(self, send):
		await send({
			"type": "websocket.close",
			"code": 4403
		})

	async def __call__(self, scope, receive, send):
		query_string: bytes = scope.get("query_string", b"")
		decoded_query_string = query_string.decode()

		access_token = parse_qs(decoded_query_string)["token"][0]
		

		if access_token == None:
			await self.send_unauthorized_message(send)

			return 

		authenticated_user = await self.authenticate(access_token)
		

		if authenticated_user == AnonymousUser():
			
			await self.send_unauthorized_message(send)

			return 
		
		
		
		scope["user"] = authenticated_user
		

		await self.inner(scope, receive, send)
		

	async def authenticate(self, access_token):
		secret_key = settings.SECRET_KEY
		algorithm = "HS256"

		try:
			decoded_access_token = jwt.decode(access_token, secret_key, [algorithm])
		except (InvalidSignatureError, ExpiredSignatureError, DecodeError, InvalidTokenError):
			
			return AnonymousUser()
		else:
			user_id = decoded_access_token.get("user_id")
			
			
			try:
				authenticated_user = await get_authenticated_user(user_id)
			except ObjectDoesNotExist:
				return AnonymousUser()

			
			return authenticated_user