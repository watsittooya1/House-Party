from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()

class GetRoom(APIView):
    lookup_url_kwarg = 'code'

    def get(self, request):
        code = request.GET.get(self.lookup_url_kwarg)
        if code == None:
            return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)

        room = Room.objects.filter(code=code)
        if len(room) == 0:
            return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)
            
        data = RoomSerializer(room[0]).data
        data['is_host'] = self.request.session.session_key == room[0].host
        return Response(data, status=status.HTTP_200_OK)
        
        
class CreateRoomView(APIView):
    
    def post(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = CreateRoomSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'Bad Request': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
            
        guest_can_pause = serializer.data.get('guest_can_pause')
        guest_can_queue = serializer.data.get('guest_can_queue')
        votes_to_skip = serializer.data.get('votes_to_skip')
        host = self.request.session.session_key
        queryset = Room.objects.filter(host=host)
        
        # if user is not host of any rooms, create
        if not queryset.exists():
            room = Room(host=host, guest_can_pause=guest_can_pause, guest_can_queue=guest_can_queue, votes_to_skip=votes_to_skip)
            room.save()
            self.request.session['room_code'] = room.code
            return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
        
        # otherwise, update host's current room to settings of new room and place them in the room
        room = queryset[0]
        room.guest_can_pause = guest_can_pause
        room.guest_can_queue = guest_can_queue
        room.votes_to_skip = votes_to_skip
        room.save(update_fields=['guest_can_pause', 'guest_can_queue', 'votes_to_skip'])
        self.request.session['room_code'] = room.code
        return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
        
            
class JoinRoom(APIView):
    lookup_url_kwarg = 'code'

    def post(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.data.get(self.lookup_url_kwarg)
        if code == None:
            return Response({'Bad Request': 'Room code required'}, status=status.HTTP_400_BAD_REQUEST)
        
        room_result = Room.objects.filter(code=code)
        if len(room_result) == 0:
            return Response({'Not Found': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        
        room = room_result[0]
        self.request.session['room_code'] = room.code
        return Response(status=status.HTTP_200_OK)
        
        
class LeaveRoom(APIView):
    def post(self):
        if 'room_code' in self.request.session:
            self.request.session.pop('room_code')

            # check if user was host of room, if so delete
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host=host_id)
            if len(room_results) > 0:
                room = room_results[0]
                room.delete()
            
        return Response(status=status.HTTP_200_OK)


class UserInRoom(APIView):

    def get(self):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        #json serializer pertains to regular python dicts, as opposed to something
        # like rooms or room creations
        return JsonResponse({ 'code': self.request.session.get('room_code') }, status=status.HTTP_200_OK)


class UpdateRoom(APIView):
    def patch(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = UpdateRoomSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'Bad Request': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)


        queryset = Room.objects.filter(code=serializer.data.get('code'))
        if not queryset.exists():
            return Response({'Not Found': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)

        room = queryset[0]
        user_id = self.request.session.session_key
        if room.host != user_id:
            return Response({'Forbidden': 'Only the room host is allowed to update the room'}, status=status.HTTP_403_FORBIDDEN)

        room.guest_can_pause = serializer.data.get('guest_can_pause')
        room.guest_can_queue = serializer.data.get('guest_can_queue')
        room.votes_to_skip = serializer.data.get('votes_to_skip')
        room.save(update_fields=['guest_can_pause', 'guest_can_queue', 'votes_to_skip'])
        return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
        
        




