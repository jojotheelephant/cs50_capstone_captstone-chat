from django.urls import re_path

from .consumer import ChatConsumer

websocket_urlpatterns = [
    #<room_name> is sent as parameter to chatconsumer consumer. 
    re_path(r'ws/chat/(?P<room_name>\w+)/$', ChatConsumer.as_asgi())
]