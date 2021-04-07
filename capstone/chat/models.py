from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.aggregates import Count

User = get_user_model()

class ChatRoom(models.Model):
    room_name  = models.CharField(max_length=30, unique=True, blank=False, default="newroom")
    users = models.ManyToManyField(User, related_name="user_chat", blank=True)

    def room_id(self):
        return self.id

    def __str__(self):
        return self.room_name


class Message(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='author_message')
    content = models.CharField(max_length=300)
    timestamp = models.DateTimeField(auto_now_add=True)
    chatroom = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='chatroom_message', default="")

    def __str__(self):
        return self.author.username

    def message_id(self):
        return self.id

    def chatroom_name(self):
        return self.chatroom.room_name
    
    def last_15_messages(self, room_name):
        return Message.objects.filter(room_name=self.chatroom.room_name
        ).order_by('-timestamp').all()[:15]

