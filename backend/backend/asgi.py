import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

import users_api.routing
import matchmaking_api.routing
import gameplay_api.routing

from users_api.middleware.auth_middleware import JWTAuthenticationMiddleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

users_api_urls = users_api.routing.websocket_urlpatterns
matchmaking_api_urls = matchmaking_api.routing.websocket_urlpatterns
gameplay_api_urls = gameplay_api.routing.websocket_urlpatterns

websocket_routes = users_api_urls + matchmaking_api_urls + gameplay_api_urls

application = ProtocolTypeRouter({
	"http": get_asgi_application(),
	"websocket": JWTAuthenticationMiddleware(URLRouter(websocket_routes))
})
