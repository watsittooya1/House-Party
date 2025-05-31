from django.shortcuts import redirect
from .credentials import REDIRECT_URI, CLIENT_SECRET, CLIENT_ID
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import *
from api.models import Room
from .models import Vote
import requests


# request auth from Spotify
class AuthUrlView(APIView):
    def get(self, request):
        # found from Spotify API documentation
        show_dialog = False or request.GET.get('show-dialog')
        scopes = 'streaming user-read-playback-state user-modify-playback-state user-read-currently-playing'
        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID,
            'show_dialog': show_dialog,
        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)


class AuthTokenView(APIView):
    def get(self, request):
        is_host = (request.GET.get('host') == 'true')
        if is_host:
            host = self.request.session.session_key
        else:
            room_code = self.request.session.get('room_code')
            room = Room.objects.filter(code=room_code)
            
            if not room.exists():
                return Response({'Not Found': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
            
            room = room[0]    
            host = room.host
        if not request.session.exists(request.session.session_key):
            request.session.create()

        token = get_user_tokens(host)
        if token == None:
            return Response({}, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({'token':token.access_token}, status=status.HTTP_200_OK)



# request for access/refresh token
def spotify_callback(request):
    code = request.GET.get('code')
    error = request.GET.get('error')

    if error == "access_denied":
        return redirect('frontend:')
    

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
    
    # using format - APPLICATION: - redirects to a different app 
    return redirect('frontend:')


class IsAuthenticated(APIView):
    def get(self, request):
        is_host = (request.GET.get('host') == 'true')
        if is_host:
            host = self.request.session.session_key
        else:
            room_code = self.request.session.get('room_code')
            room = Room.objects.filter(code=room_code)
            if room.exists():
                room = room[0]
            else:
                return Response({}, status=status.HTTP_404_NOT_FOUND)
            host = room.host
        is_authenticated = is_spotify_authenticated(host)
        return Response({
            'status': is_authenticated
        }, status=status.HTTP_200_OK)


class CurrentSongView(APIView):
    def get(self):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if not room_code or not room.exists():
            return Response({'Precondition Failed': 'User is not in a room'}, status=status.HTTP_412_PRECONDITION_FAILED)
            
        room = room[0]
        # we pass the sessionId of the host to get room info
        headers = prepare_headers(room.host)
        response = requests.get(SPOTIFY_BASE_URL + "player/currently-playing", headers=headers).json()
        
        item = response.get('item')
        song_id = item.get('id')
        artist_string = ""
        for i, artist in enumerate(item.get('artists')):
            if i > 0:
                artist_string += ", "
            name = artist.get('name')
            artist_string += name

        votes = len(Vote.objects.filter(room=room, song_id=song_id))
        # cy TODO: how many of these fields are necessary?
        song = {
            'title': item.get('name'),
            'artist': artist_string,
            'duration': item.get('duration_ms'),
            'time': response.get('progress_ms'),
            'image_url': item.get('album').get('images')[0].get('url'),
            'is_playing': response.get('is_playing'),
            'votes': votes,
            'votes_required': room.votes_to_skip,
            'id': song_id
        }

        if room.current_song != song_id:
            room.current_song = song_id
            room.save(update_fields=['current_song'])
            votes = Vote.objects.filter(room=room).delete()

        return Response(song, status=status.HTTP_200_OK)
    

class PauseSongView(APIView):
    def put(self):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        
        if not room_code or not room.exists():
            return Response({'Precondition Failed': 'User is not in a room'}, status=status.HTTP_412_PRECONDITION_FAILED)
        
        if (self.request.session.session_key != room.host and room.guest_can_pause):
            return Response({'Forbidden': 'You are not authorized to pause the room\'s song'}, status=status.HTTP_403_FORBIDDEN)
        
        room = room[0]
        # we pass the sessionId of the host to get room info
        headers = prepare_headers(room.host)
        requests.put(SPOTIFY_BASE_URL + "player/pause", headers=headers)
        
        return Response(status=status.HTTP_200_OK)
    
    
class PlaySongView(APIView):
    def put(self):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        
        if not room_code or not room.exists():
            return Response({'Precondition Failed': 'User is not in a room'}, status=status.HTTP_412_PRECONDITION_FAILED)
        
        if (self.request.session.session_key != room.host and room.guest_can_pause):
            return Response({'Forbidden': 'You are not authorized to pause the room\'s song'}, status=status.HTTP_403_FORBIDDEN)
        
        room = room[0]
        # we pass the sessionId of the host to get room info
        headers = prepare_headers(room.host)
        response = requests.put(SPOTIFY_BASE_URL + "player/play", headers=headers).json()

        # The host is not connected switched to the SDK, so get the SDK id and switch to it
        if response != None and 'error' in response and response['error']['reason'] == 'NO_ACTIVE_DEVICE':
            
            response = requests.get(SPOTIFY_BASE_URL + 'player/devices', headers=headers)
            
            sdk = list(filter(lambda item: item['name'] == "Web Playback SDK", response['devices']))[0]
            requests.put(SPOTIFY_BASE_URL + 'player', headers, json={'device_ids': [sdk['id']]})

        return Response(status=status.HTTP_200_OK)

class SkipSongView(APIView):
    def post(self):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]

        if not room_code or not room.exists():
            return Response({'Precondition Failed': 'User is not in a room'}, status=status.HTTP_412_PRECONDITION_FAILED)

        votes = Vote.objects.filter(room=room, song_id=room.current_song)
        votes_needed = room.votes_to_skip

        # if user has already voted
        if any(v.user == self.request.session.session_key for v in votes):
            return Response({'Forbidden': 'User has already voted to skip'}, status=status.HTTP_403_FORBIDDEN)
        
        if self.request.session.session_key == room.host or len(votes) + 1 >= votes_needed:
            votes.delete()
            headers = prepare_headers(room.host)
            requests.post(SPOTIFY_BASE_URL + "player/play", headers=headers)
        else:
            vote = Vote(user=self.request.session.session_key, room=room, song_id=room.current_song)
            vote.save()

        return Response(status=status.HTTP_200_OK)


class QueueView(APIView):
    def get(self):
        room_code = self.request.session.get('room_code')
        rooms = Room.objects.filter(code=room_code)
        if not room_code or not rooms.exists():
            return Response({'Precondition Failed': 'User is not in a room'}, status=status.HTTP_412_PRECONDITION_FAILED)
    
        headers = prepare_headers(rooms[0].host)
        response = requests.get(SPOTIFY_BASE_URL + 'player/queue', headers=headers).json()
        
        songs = []
        for item in response.get("queue"):
            songs.append({
                "album":item.get("album").get("name"),
                "image":item.get("album").get("images")[0],
                "artists":map(lambda a: a.get("name"), item.get("artists")),
                "name":item.get("name"),
                "id":item.get("id")
            })

        return Response(songs, status=status.HTTP_200_OK)
    
    def post(self, request):
        room_code = self.request.session.get('room_code')
        rooms = Room.objects.filter(code=room_code)
        if not room_code or not rooms.exists():
            return Response({'Precondition Failed': 'User is not in a room'}, status=status.HTTP_412_PRECONDITION_FAILED)

        track_uri = request.GET.get('uri')
        headers = prepare_headers(rooms[0].host)
        requests.post(SPOTIFY_BASE_URL + f'player/queue?uri={track_uri}', headers=headers)
        
        return Response(status=status.HTTP_200_OK)
    

class SearchView(APIView):
    def get(self, request):
        room_code = self.request.session.get('room_code')
        rooms = Room.objects.filter(code=room_code)
        if not room_code or not rooms.exists():
            return Response({'Precondition Failed': 'User is not in a room'}, status=status.HTTP_412_PRECONDITION_FAILED)

        track_query = request.GET.get('track')
        headers = prepare_headers(rooms[0].host)
        endpoint = f'https://api.spotify.com/v1/search/?q={track_query}&type=track'
        response = requests.get(endpoint, headers=headers).json()

        songs = []
        for item in response.get("tracks").get("items"):
            songs.append({
                "album":item.get("album").get("name"),
                "image":item.get("album").get("images")[0],
                "artists":map(lambda a: a.get("name"), item.get("artists")),
                "name":item.get("name"),
                "uri":item.get("uri")
            })
            
        return Response(songs, status=status.HTTP_200_OK)


class UsernameView(APIView):
    def get(self, request):

        if not request.session.exists(request.session.session_key):
            request.session.create()
        
        tokens = get_user_tokens(request.session.session_key)
        
        if not tokens:
            return Response({"Unauthorized":"User is not logged into Spotify"}, status=status.HTTP_401_UNAUTHORIZED)
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + tokens.access_token
        }
        
        response = requests.get(SPOTIFY_BASE_URL, {}, headers=headers).json()

        return Response({"username": response.get('display_name')}, status=status.HTTP_200_OK)
        
