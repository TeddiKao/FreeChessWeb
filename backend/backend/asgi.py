import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

import users_api.routing
import matchmaking_api.routing

from users_api.middleware.auth_middleware import JWTAuthenticationMiddleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

websocket_routes = users_api.routing.websocket_urlpatterns + matchmaking_api.routing.websocket_urlpatterns

application = ProtocolTypeRouter({
	"http": get_asgi_application(),
	"websocket": JWTAuthenticationMiddleware(URLRouter(websocket_routes))
})
