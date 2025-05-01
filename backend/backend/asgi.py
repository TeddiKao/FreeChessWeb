import os

from django.core.asgi import get_asgi_application
django_asgi_application = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter

from users.middleware.auth_middleware import JWTAuthenticationMiddleware

import users.routing
import matchmaking.routing
import gameplay.routing
import bots.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

users_app_urls = users.routing.websocket_urlpatterns
matchmaking_app_urls = matchmaking.routing.websocket_urlpatterns
gameplay_app_urls = gameplay.routing.websocket_urlpatterns
bot_app_urls = bots.routing.websocket_urlpatterns

websocket_routes = users_app_urls + matchmaking_app_urls + gameplay_app_urls + bot_app_urls

application = ProtocolTypeRouter({
	"http": django_asgi_application,
	"websocket": JWTAuthenticationMiddleware(URLRouter(websocket_routes))
})
