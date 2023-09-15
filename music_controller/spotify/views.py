from django.shortcuts import render, redirect
from .credentials import REDIRECT_URI, CLIENT_SECRET, CLIENT_ID
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import *
from api.models import Room
from .models import Vote


# request auth from Spotify
class AuthURL(APIView):
    def get(self, request, format=None):
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


class GetAuthToken(APIView):
    def get(self, request, format=None):
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
        if not request.session.exists(request.session.session_key):
            request.session.create()

        token = get_user_tokens(host)
        if token == None:
            return Response({}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({'token':token.access_token}, status=status.HTTP_200_OK)



# request for access/refresh token
def spotify_callback(request, format=None):
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
    def get(self, request, format=None):
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

class CurrentSong(APIView):
    
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        host = room.host
        endpoint = "player/currently-playing"
        response = execute_spotify_api_request(host, endpoint)

        if response == None or 'error' in response or 'item' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        
        item = response.get('item')
        duration = item.get('duration_ms')
        progress = response.get('progress_ms')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        song_id = item.get('id')
        artist_string = ""
        for i, artist in enumerate(item.get('artists')):
            if i > 0:
                artist_string += ", "
            name = artist.get('name')
            artist_string += name

        votes = len(Vote.objects.filter(room=room, song_id=song_id))
        song = {
            'title': item.get('name'),
            'artist': artist_string,
            'duration': duration,
            'time': progress,
            'image_url': album_cover,
            'is_playing': is_playing,
            'votes': votes,
            'votes_required': room.votes_to_skip,
            'id': song_id
        }

        self.update_room_song(room, song_id)

        return Response(song, status=status.HTTP_200_OK)
    

    def update_room_song(self, room, song_id):
        current_song = room.current_song
        if current_song != song_id:
            room.current_song = song_id
            room.save(update_fields=['current_song'])
            votes = Vote.objects.filter(room=room).delete()
    

class PauseSong(APIView):
    def put(self, response, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        if self.request.session.session_key == room.host or room.guest_can_pause:
            pause_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        return Response({}, status=status.HTTP_403_FORBIDDEN)
    
class PlaySong(APIView):
    def put(self, response, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        if self.request.session.session_key == room.host or room.guest_can_pause:
            play_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        return Response({}, status=status.HTTP_403_FORBIDDEN)

class SkipSong(APIView):
    def post(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]

        votes = Vote.objects.filter(room=room, song_id=room.current_song)
        votes_needed = room.votes_to_skip

        # if user has already voted
        if len(votes.filter(user=self.request.session.session_key)) > 0:
            return Response({}, status=status.HTTP_403_FORBIDDEN)
        
        if self.request.session.session_key == room.host or len(votes) + 1 >= votes_needed:
            votes.delete()
            skip_song(room.host)
        else:
            vote = Vote(user=self.request.session.session_key, room=room, song_id=room.current_song)
            vote.save()

        return Response({}, status=status.HTTP_204_NO_CONTENT)


class GetQueue(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]

        res = get_queue(room.host)
        songs = []
        for item in res.get("queue"):
            song = {
                "album":item.get("album").get("name"),
                "image":item.get("album").get("images")[0],
                "artists":map(lambda a: a.get("name"), item.get("artists")),
                "name":item.get("name"),
                "id":item.get("id")
            }
            songs.append(song)

        return Response(songs, status=status.HTTP_200_OK)
    

class SearchTrack(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]

        track_query = request.GET.get('track')

        res = search_track(room.host, track_query)

        songs = []
        for item in res.get("tracks").get("items"):
            song = {
                "album":item.get("album").get("name"),
                "image":item.get("album").get("images")[0],
                "artists":map(lambda a: a.get("name"), item.get("artists")),
                "name":item.get("name"),
                "uri":item.get("uri")
            }
            songs.append(song)

        return Response(songs, status=status.HTTP_200_OK)


class AddToQueue(APIView):
    def post(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]

        track_uri = request.GET.get('uri')
        add_to_queue(room.host, track_uri)
        
        return Response({}, status=status.HTTP_200_OK)


class GetUserName(APIView):
    def get(self, request, format=None):

        if not request.session.exists(request.session.session_key):
            request.session.create()

        res = get_user_name(request.session.session_key)
        
        if res == None:
            return Response({"username":""}, status=status.HTTP_200_OK)

        return Response({"username":res.get('display_name')}, status=status.HTTP_200_OK)