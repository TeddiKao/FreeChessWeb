import jwt

class AuthenticationMiddleware:
	def __init__(self, get_response):
		self.get_response = get_response

	def __call__(self, request):
		token = request.headers.get("access_token")
		decoded_token = jwt.decode(token)

		print(decoded_token)