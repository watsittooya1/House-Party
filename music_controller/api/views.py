from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from .models import Room, RoomMember
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

class RoomsView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class RoomView(APIView):
    lookup_url_kwarg = 'code'

    # GET room
    def get(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
            
        code = request.GET.get(self.lookup_url_kwarg)
        if code == None:
            return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)

        room = Room.objects.filter(code=code)
        if len(room) == 0:
            return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)
            
        data = RoomSerializer(room[0]).data
        data['is_host'] = self.request.session.session_key == room[0].host
        return Response(data, status=status.HTTP_200_OK)
    
    # CREATE room
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
            
            room_member = RoomMember(user_id=self.request.session.session_key, room=room)
            room_member.save()
            return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
        
        # otherwise, update host's current room to settings of new room and place them in the room
        # do NOT change the room code
        room = queryset[0]
        room.guest_can_pause = guest_can_pause
        room.guest_can_queue = guest_can_queue
        room.votes_to_skip = votes_to_skip
        room.save(update_fields=['guest_can_pause', 'guest_can_queue', 'votes_to_skip'])
        
        return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
    
    # UPDATE room
    def patch(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = UpdateRoomSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'Bad Request': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)

        room_membership_query = RoomMember.objects.filter(user_id=self.request.session.session_key)
        if len(room_membership_query) == 0:
            return Response({'Not Found': 'User not in room'}, status=status.HTTP_404_NOT_FOUND)

        room_query = Room.objects.filter(code=room_membership_query[0].room.code)
        if len(room_query) == 0:
            return Response({'Not Found': 'User\'s room not found'}, status=status.HTTP_404_NOT_FOUND)
        
        room = room_query[0]
        if room.host != self.request.session.session_key:
            return Response({'Forbidden': 'Only the room host is allowed to update the room'}, status=status.HTTP_403_FORBIDDEN)

        room.guest_can_pause = serializer.data.get('guest_can_pause')
        room.guest_can_queue = serializer.data.get('guest_can_queue')
        room.votes_to_skip = serializer.data.get('votes_to_skip')
        room.save(update_fields=['guest_can_pause', 'guest_can_queue', 'votes_to_skip'])
        return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            
            
class JoinRoomView(APIView):
    def post(self, request, code):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        if code == None:
            return Response({'Bad Request': 'Room code required'}, status=status.HTTP_400_BAD_REQUEST)
        
        room_membership_query = RoomMember.objects.filter(user_id=self.request.session.session_key)
        if len(room_membership_query) != 0:
            return Response({'Forbidden': 'User is already in a room'}, status=status.HTTP_403_FORBIDDEN)
        
        room_query = Room.objects.filter(code=code.upper())
        if len(room_query) == 0:
            return Response({'Not Found': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        
        room = room_query[0]
        room_member = RoomMember(user_id=self.request.session.session_key, room=room)
        room_member.save()
        return Response({"code": code }, status=status.HTTP_200_OK)
        
        
class LeaveRoomView(APIView):
    def post(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        room_membership_query = RoomMember.objects.filter(user_id=self.request.session.session_key)
        if len(room_membership_query) == 0:
            return Response({'Precondition Failed': 'User is not in a room'}, status=status.HTTP_412_PRECONDITION_FAILED)
        
        room_membership = room_membership_query[0]
        room_membership.delete()
        
        # check if user was host of room, if so delete
        room_results = Room.objects.filter(host=self.request.session.session_key)
        if len(room_results) > 0:
            room = room_results[0]
            room.delete()
            
        return Response(status=status.HTTP_200_OK)


class CurrentRoomView(APIView):
    def get(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
            
        room_membership_query = RoomMember.objects.filter(user_id=self.request.session.session_key)
        if len(room_membership_query) == 0:
            return JsonResponse({ 'code': None }, status=status.HTTP_200_OK)

        room_membership = room_membership_query[0]
        return JsonResponse({ 'code': room_membership.room.code }, status=status.HTTP_200_OK)
    