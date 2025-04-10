import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

import users.routing
import matchmaking.routing
import gameplay.routing

from users.middleware.auth_middleware import JWTAuthenticationMiddleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

users_api_urls = users.routing.websocket_urlpatterns
matchmaking_api_urls = matchmaking.routing.websocket_urlpatterns
gameplay_api_urls = gameplay.routing.websocket_urlpatterns

websocket_routes = users_api_urls + matchmaking_api_urls + gameplay_api_urls

application = ProtocolTypeRouter({
	"http": get_asgi_application(),
	"websocket": JWTAuthenticationMiddleware(URLRouter(websocket_routes))
})
