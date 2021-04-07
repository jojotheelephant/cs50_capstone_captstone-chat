from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import render
from .models import ChatRoom, Message, User
from rest_framework import permissions, serializers, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, UserSerializerWithToken, ChatRoomSerializer

@api_view(['GET'])
def current_user(request):
    """
    Determine the current user by their token, and return their data
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['POST'])
def AddRoom(request, newroomname):
    if request.method != "POST": 
        return Response({'error': 'POST requests only'})
    if newroomname == "":
        return Response({'error': 'User required in request for chatroomlist'})
    if len(newroomname) > 18:
        return Response({'error': 'Room Name must be characters or less'})
    if request.method == 'POST':
        user = User.objects.filter(username=request.user)[0]
        room_count = ChatRoom.objects.filter(room_name=newroomname).count()
        if room_count == 0:
            ChatRoom.objects.create(room_name=newroomname)
            created_room = ChatRoom.objects.filter(room_name=newroomname)
            created_room[0].users.add(user)
            return Response(status=status.HTTP_201_CREATED)
        if room_count == 1:
            existing_room = ChatRoom.objects.filter(room_name=newroomname)
            existing_room[0].users.add(user)
            return Response(status=status.HTTP_202_ACCEPTED)

@api_view(['POST'])
def RemoveRoom(request, roomname):
    if request.method != "POST": 
        return Response({'error': 'POST requests only'})
    if request.method == 'POST':
        user = User.objects.filter(username=request.user)[0]
        room = ChatRoom.objects.filter(room_name=roomname)
        room[0].users.remove(user)
        return Response(status=status.HTTP_202_ACCEPTED)

class UserList(APIView):
    """
    Create a new user. It's called 'UserList' because normally we'd have a get
    method here too, for retrieving a list of all User objects.
    """
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Create your views here.
def index(request): 
    return render(request, 'chat/index.html')

def room(request, room_name):
    return render(request, 'chat/room.html', {
        'room_name': room_name,
        'username': request.user.username
    })

def chatroomlist(request, currentuser):
    if request.method != "GET": 
        return JsonResponse({'error': 'GET requests only'})
    if currentuser == "":
        return JsonResponse({'error': 'User required in request for chatroomlist'})

    listofrooms = list(ChatRoom.objects.filter(users__username=currentuser).values())
    print(listofrooms)

    return JsonResponse({'listofrooms': listofrooms}, safe=False)

def createroom(request, newroomname):
    if request.method != "POST": 
        return JsonResponse({'error': 'POST requests only'})
    if newroomname == "":
        return JsonResponse({'error': 'User required in request for chatroomlist'})
    if len(newroomname) > 18:
        return JsonResponse({'error': 'Room Name must be characters or less'})

    roomexist = ChatRoom.objets.filter(room_name=newroomname).count()
    username = request.user.username
    print(username)
    # if there are rooms that currently share the same name, check if user is already in that room, add to room
    if roomexist > 0:
        pass
    # if there aren't any rooms with that name already, create a new room and add user to room. 
    if roomexist == 0:
        pass


