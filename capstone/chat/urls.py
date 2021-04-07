from django.urls import path

from .views import index, room, chatroomlist, createroom, current_user, UserList, AddRoom, RemoveRoom

urlpatterns = [
    path('', index, name='index'),
    path('current_user/', current_user),
    path('users/', UserList.as_view()),
    path('<str:room_name>/', room, name='room'),
    path('chatroomlist/<str:currentuser>/', chatroomlist, name='chatroomlist'),
    path('removeroom/<str:roomname>/', RemoveRoom, name="removeroom"),
    path('createroom/<str:newroomname>/', AddRoom, name='addroom')
]
