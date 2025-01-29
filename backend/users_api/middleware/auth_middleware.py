from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist

from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser

import jwt
from jwt import InvalidSignatureError, ExpiredSignatureError, DecodeError, InvalidTokenError

User = get_user_model()

class JWTAuthenticationMiddleware:
	async def __init__(self):
		self.unauthorised_message = {
			"type": "websocket.close",
			"code": 4403
		}

	async def __call__(self, scope, receive, send):
		access_token = scope.get("subprotocols", [None])[0]
		if access_token == None:
			return await send(self.unauthorised_message)

		authenticated_user = await self.authenticate(access_token)
		if authenticated_user == AnonymousUser():
			return await send(self.unauthorised_message)
		
		scope["user"] = authenticated_user

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
				user_model = get_user_model(id=user_id)
			except ObjectDoesNotExist:
				return AnonymousUser()

			return user_model	