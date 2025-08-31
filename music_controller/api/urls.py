from django.urls import path
from .views import RoomsView, RoomView, JoinRoomView, LeaveRoomView, CurrentRoomView

urlpatterns = [
    # may want to remove this
    path('rooms', RoomsView.as_view()),
    
    path('room', RoomView.as_view()),
    path('room/join/<str:code>', JoinRoomView.as_view()),
    path('room/leave', LeaveRoomView.as_view()),
    path('room/current', CurrentRoomView.as_view()),
]
