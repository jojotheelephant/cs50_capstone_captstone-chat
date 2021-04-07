from django.contrib import admin
from .models import  ChatRoom, Message

# Register your models here.
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ( 'room_id','room_name')

class MessageAdmin(admin.ModelAdmin):
    list_display = ('message_id', 'author', 'timestamp', 'chatroom_name', 'content')

admin.site.register(Message, MessageAdmin)
admin.site.register(ChatRoom, ChatRoomAdmin)

admin.site.site_header = "Django React CS50 Capostone Chat"