from django.shortcuts import redirect
from .credentials import REDIRECT_URI, CLIENT_SECRET, CLIENT_ID
from rest_framework.views import APIView
from requests import Request
from rest_framework import status
from rest_framework.response import Response
from .util import *
from api.models import Room, RoomMember
from .models import Vote
import requests

SPOTIFY_SCOPES = 'streaming user-read-playback-state user-modify-playback-state user-read-currently-playing'

# request to Spotify API for access/refresh token
def spotify_callback(request):
    code = request.GET.get('code')
    error = request.GET.get('error')

    if error == "access_denied":
        return redirect('/')

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(
        request.session.session_key,
        access_token,
        token_type,
        expires_in,
        refresh_token)
    
    # cy TODO: temp frontend redirect
    return redirect('http://localhost:5173')
    #return redirect('/')


class AuthUrlView(APIView):
    def get(self, request):
        # found from Spotify API documentation
        show_dialog = False or request.GET.get('show-dialog')
        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': SPOTIFY_SCOPES,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID,
            'show_dialog': show_dialog,
        }).prepare().url

        return Response({ 'url': url }, status=status.HTTP_200_OK)


class HostTokenView(APIView):
    def get(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
            
        room_member_query = RoomMember.objects.filter(user_id=self.request.session.session_key)
        if len(room_member_query) == 0:
            return Response({'Precondition Failed': 'User is not in a room'}, status=status.HTTP_412_PRECONDITION_FAILED)
        
        room_query = Room.objects.filter(code=room_member_query[0].room.code)
        if len(room_query) == 0:
            return Response({'Not Found': 'User\'s room not found'}, status=status.HTTP_404_NOT_FOUND)
        
        host = room_query[0].host
        token = get_user_tokens(host)
        if token == None:
            return Response({}, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({ 'token': token.access_token }, status=status.HTTP_200_OK)


class CurrentTrackView(APIView):
    def get(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
            
        room_member_query = RoomMember.objects.filter(user_id=self.request.session.session_key)
        if len(room_member_query) == 0:
            return Response({'Precondition Failed': 'User is not in a room'}, status=status.HTTP_412_PRECONDITION_FAILED)
        
        room_query = Room.objects.filter(code=room_member_query[0].room.code)
        if len(room_query) == 0:
            return Response({'Not Found': 'User\'s room not found'}, status=status.HTTP_404_NOT_FOUND)
        
        room = room_query[0]
        # we pass the sessionId of the host to get room info
        headers = prepare_headers(room.host)
        response = requests.get(SPOTIFY_BASE_URL + "player/currently-playing", headers=headers)
        
        if not response.ok:
            return Response(
                    {'Internal Server Error': 'Failed to get current track'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        # endpoint can return 204 if no track is being played
        response_json = response.json() if response.status_code == 200 else None
        track_id = response_json and response_json.get('item').get('id')

        if track_id:
            # add vote fields
            response_json['votes'] = len(Vote.objects.filter(room=room, track_id=track_id))
            response_json['votes_to_skip'] = room.votes_to_skip
            if room.current_track != track_id:
                room.current_track = track_id
                room.save(update_fields=['current_track'])
                Vote.objects.filter(room=room).delete()

        return Response(response_json, status=response.status_code)
    

class PauseSongView(APIView):
    def put(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
            
        room_member_query = RoomMember.objects.filter(user_id=self.request.session.session_key)
        if len(room_member_query) == 0:
            return Response({'Precondition Failed': 'User is not in a room'}, status=status.HTTP_412_PRECONDITION_FAILED)
        
        room_query = Room.objects.filter(code=room_member_query[0].room.code)
        if len(room_query) == 0:
            return Response({'Not Found': 'User\'s room not found'}, status=status.HTTP_404_NOT_FOUND)
        
        room = room_query[0]
        
        if (self.request.session.session_key != room.host and not room.guest_can_pause):
            return Response({'Forbidden': 'Guests are not allowed to play/pause tracks for this room'}, status=status.HTTP_403_FORBIDDEN)
        
        # we pass the sessionId of the host to get room info
        headers = prepare_headers(room.host)
        pause_response = requests.put(SPOTIFY_BASE_URL + "player/pause", headers=headers)
        
        if not pause_response.ok:
            return Response(
                {'Internal Server Error': 'Failed to skip track'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(status=status.HTTP_200_OK)
    
    
class PlaySongView(APIView):
    def put(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
            
        room_member_query = RoomMember.objects.filter(user_id=self.request.session.session_key)
        if len(room_member_query) == 0:
            return Response({'Precondition Failed': 'User is not in a room'}, status=status.HTTP_412_PRECONDITION_FAILED)
        
        room_query = Room.objects.filter(code=room_member_query[0].room.code)
        if len(room_query) == 0:
            return Response({'Not Found': 'User\'s room not found'}, status=status.HTTP_404_NOT_FOUND)
        
        room = room_query[0]
        
        if (self.request.session.session_key != room.host and room.guest_can_pause):
            return Response({'Forbidden': 'Guests are not allowed to play/pause tracks for this room'}, status=status.HTTP_403_FORBIDDEN)
        
        # we pass the sessionId of the host to get room info
        headers = prepare_headers(room.host)
        response = requests.put(SPOTIFY_BASE_URL + "player/play", headers=headers)

        # The host is not connected to an active device, so attempt to connect to the SDK
        if not response.ok:
            response_body = response.json()
            if 'error' in response_body and response_body['error']['reason'] == 'NO_ACTIVE_DEVICE':
                get_devices_response = requests.get(SPOTIFY_BASE_URL + 'player/devices', headers=headers).json()
                
                sdk = next((device for device in get_devices_response.get('devices') if device.get('name') == 'Web Playback SDK'), None)
                if not sdk:
                    # cy TODO: sometimes this endpoint will inexplicably return 412... why?
                    return Response(
                        {'Precondition Failed': 'Host is not connected to an active device, and could not find the SDK'}, 
                        status=status.HTTP_412_PRECONDITION_FAILED)
                
                set_device_response = requests.put(SPOTIFY_BASE_URL + 'player', headers=headers, json={'device_ids': [sdk.get('id')]})
                if not set_device_response.ok:
                    return Response(
                        {'Internal Server Error': 'Failed to change device to Web Playback SDK'}, 
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                return Response(
                    {'Internal Server Error': 'Failed to play track'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(status=status.HTTP_200_OK)


class SkipSongView(APIView):
    def post(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
            
        room_member_query = RoomMember.objects.filter(user_id=self.request.session.session_key)
        if len(room_member_query) == 0:
            return Response({'Precondition Failed': 'User is not in a room'}, status=status.HTTP_412_PRECONDITION_FAILED)
        
        room_query = Room.objects.filter(code=room_member_query[0].room.code)
        if len(room_query) == 0:
            return Response({'Not Found': 'User\'s room not found'}, status=status.HTTP_404_NOT_FOUND)
        
        room = room_query[0]

        votes = Vote.objects.filter(room=room, track_id=room.current_track)
        votes_needed = room.votes_to_skip

        # if user has already voted
        if any(v.user == self.request.session.session_key for v in votes):
            return Response({'Forbidden': 'User has already voted to skip'}, status=status.HTTP_403_FORBIDDEN)
        
        if self.request.session.session_key == room.host or len(votes) + 1 >= votes_needed:
            headers = prepare_headers(room.host)
            skip_response = requests.post(SPOTIFY_BASE_URL + "player/next", headers=headers)
            if not skip_response.ok:
                return Response(
                    {'Internal Server Error': 'Failed to skip track'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            votes.delete()
        else:
            vote = Vote(user=self.request.session.session_key, room=room, track_id=room.current_track)
            vote.save()

        return Response(status=status.HTTP_200_OK)


class QueueView(APIView):
    def get(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
            
        room_member_query = RoomMember.objects.filter(user_id=self.request.session.session_key)
        if len(room_member_query) == 0:
            return Response({'Precondition Failed': 'User is not in a room'}, status=status.HTTP_412_PRECONDITION_FAILED)
        
        room_query = Room.objects.filter(code=room_member_query[0].room.code)
        if len(room_query) == 0:
            return Response({'Not Found': 'User\'s room not found'}, status=status.HTTP_404_NOT_FOUND)
        
        room = room_query[0]
        headers = prepare_headers(room.host)
        queue_response = requests.get(SPOTIFY_BASE_URL + 'player/queue', headers=headers)
        if not queue_response.ok:
                    return Response(
                        {'Internal Server Error': 'Failed to skip track'}, 
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'queue': queue_response.json().get('queue')}, status=status.HTTP_200_OK)
    
    def post(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
            
        room_member_query = RoomMember.objects.filter(user_id=self.request.session.session_key)
        if len(room_member_query) == 0:
            return Response({'Precondition Failed': 'User is not in a room'}, status=status.HTTP_412_PRECONDITION_FAILED)
        
        room_query = Room.objects.filter(code=room_member_query[0].room.code)
        if len(room_query) == 0:
            return Response({'Not Found': 'User\'s room not found'}, status=status.HTTP_404_NOT_FOUND)

        track_uri = request.GET.get('uri')
        headers = prepare_headers(room_query[0].host)
        response = requests.post(SPOTIFY_BASE_URL + f'player/queue?uri={track_uri}', headers=headers)
        if not response.ok:
            print(response.json())
            return Response(
                {'Internal Server Error': 'Failed to queue track'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(status=status.HTTP_200_OK)
    

class SearchView(APIView):
    def get(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
            
        room_member_query = RoomMember.objects.filter(user_id=self.request.session.session_key)
        if len(room_member_query) == 0:
            return Response({'Precondition Failed': 'User is not in a room'}, status=status.HTTP_412_PRECONDITION_FAILED)
        
        room_query = Room.objects.filter(code=room_member_query[0].room.code)
        if len(room_query) == 0:
            return Response({'Not Found': 'User\'s room not found'}, status=status.HTTP_404_NOT_FOUND)

        query = request.GET.get('q')
        headers = prepare_headers(room_query[0].host)
        endpoint = f'https://api.spotify.com/v1/search/?q={query}&type=track'
        response = requests.get(endpoint, headers=headers)
        if not response.ok:
            return Response(
                {'Internal Server Error': 'Failed to search for track'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        return Response({'tracks': response.json().get("tracks").get("items")}, status=status.HTTP_200_OK)


class UsernameView(APIView):
    def get(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        tokens = get_user_tokens(self.request.session.session_key)
        
        if not tokens:
            return Response({"Unauthorized":"User is not logged into Spotify"}, status=status.HTTP_401_UNAUTHORIZED)
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + tokens.access_token
        }
        
        response = requests.get(SPOTIFY_BASE_URL, {}, headers=headers).json()

        return Response({"username": response.get('display_name')}, status=status.HTTP_200_OK)
        
