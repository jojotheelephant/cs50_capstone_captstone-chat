import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import Message, ChatRoom

#get user
from django.contrib.auth import get_user_model
User = get_user_model()

#class with channel layer using async await
class ChatConsumer(WebsocketConsumer):
    def connect(self):
        #get room name and user 
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        self.user = self.scope['user']
        # self.room = ChatRoom.objects.filter(room_name=self.room_name)
        # if self.room: 
        #     pass
        # else: 
        #     ChatRoom.objects.create(room_name=self.room_name, users=self.user)
        print(f'the current user: {self.user}. Room name: {self.room_group_name}')
        
        #join room group
        async_to_sync(self.channel_layer.group_add) (
            self.room_group_name,
            self.channel_name
        )
        
        #accept
        self.accept()

    def disconnect(self, close_code):
        #leave room group
        async_to_sync(self.channel_layer.group_discard) (
            self.room_group_name,
            self.channel_name,
        )
    
    #get the last 15 messages from the model database
    def fetch_message(self, data, chat_room_name):
        messages = Message.objects.filter(chatroom__room_name=chat_room_name).order_by('-timestamp').all()[:25]
        content = {
            'command' : 'messages',
            'messages': self.messages_to_json(messages)
        }
        self.send_message(content)

    #turns group of messages from Message Model and runs message_to_json method on
    def messages_to_json(self, messages):
        json_messages = []
        for message in messages: 
            json_messages.append(self.message_to_json(message))
        return json_messages

    #converts an individual message into a json object
    def message_to_json(self, message):
        return {
            'id' : message.id,
            'author' : message.author.username,
            'content' : message.content,
            'timestamp' : str(message.timestamp)
        }

    def new_message(self, data, chat_room_name):
        author = data['from']
        author_user = User.objects.filter(username=author)[0]
        chatroom = ChatRoom.objects.filter(room_name=chat_room_name)[0]
        message = Message.objects.create(author=author_user, content=data['message'], chatroom=chatroom)
        content = {
            'command': 'new_message',
            'message': self.message_to_json(message)
        }
        return self.send_chat_message(content)

    # used to determine which method to run when message received from client
    actions = {
        'fetch_messages': fetch_message,
        'new_message': new_message
    }

    #receive message from client websocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        chat_room_id_json = text_data_json['chatId']
        self.actions[text_data_json['command']](self, text_data_json, chat_room_id_json)

    #sends messages to entire chat
    def send_chat_message(self, message):
        print('Message being sent is', message)
        #send message to chat room group
        async_to_sync(self.channel_layer.group_send) (
            self.room_group_name,
            { 
            'type':'chat_message',
            'message' : message
            }
        )

    #send with message object. This is done upon initial loading of messages from DB
    def send_message(self, message): 
        self.send(text_data=json.dumps(message, default=str))
    
    #grabs message from event then send
    def chat_message(self, event):
        message = event['message']
        #send message to websocket
        self.send(text_data=json.dumps(message))



# Django command to add new ChatRoom to models
## roomname
## ChatRoom.objects.create(room_name="[roomname]")

# Django command to add new Message to models
## user, roomname
## authorID = User.objects.filter(username=[user])[0].id
## chatroomID = ChatRoom.objects.filter(room_name=[roomname])[0].id
## Message.objects.create(author_id=authorID, content='new test message from shell', chatroom_id=chatroomID)

# Django command to get number of chat messages in a chatroom
## Message.objects.filter(chatroom__room_name='[roomname]').count()

# Django command to get all ChatRoom instances for user
## ChatRoom.objects.filter(users__username='[username]')