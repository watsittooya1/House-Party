from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import CLIENT_ID, CLIENT_SECRET
from requests import post, put, get

BASE_URL = "https://api.spotify.com/v1/me/"

def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None

def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token):
    tokens = get_user_tokens(session_id)
    if expires_in != None:
        expires_in = timezone.now() + timedelta(seconds=expires_in)
    else:
        expires_in = timezone.now()
    
    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=[
            'access_token',
            'refresh_token',
            'expires_in',
            'token_type'
        ])
    else:
        tokens = SpotifyToken(
            user=session_id,
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=expires_in,
            token_type=token_type
        )
        tokens.save()


def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)
    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            return refresh_spotify_token(session_id)
        else:
            return True
    return False

# returns true if refreshed, false if not logged in
def refresh_spotify_token(session_id):
    refresh_token = get_user_tokens(session_id).refresh_token
    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    # refresh token revoked
    if response.get('error') == 'invalid_grant':
        return False

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')

    # user is logged out
    if expires_in == None:
        return False

    update_or_create_user_tokens(
        session_id,
        access_token,
        token_type,
        expires_in,
        refresh_token)
    return True


def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
    tokens = get_user_tokens(session_id)
    if not tokens:
        return {'Error':'not logged in'}
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + tokens.access_token
    }
    if post_:
        response = post(BASE_URL + endpoint, headers=headers)
    elif put_:
        response = put(BASE_URL + endpoint, headers=headers)
    else:
        response = get(BASE_URL + endpoint, {}, headers=headers)
    try:
        return response.json()
    except ValueError as e:
        return
    except Exception as e:
        return {'Error': f'issue with request, {e}'}


def play_song(session_id):
    return execute_spotify_api_request(session_id, "player/play", put_=True)

def pause_song(session_id):
    return execute_spotify_api_request(session_id, "player/pause", put_=True)

def skip_song(session_id):
    return execute_spotify_api_request(session_id, "player/next", post_=True)

def get_queue(session_id):
    return execute_spotify_api_request(session_id, "player/queue")

def search_track(session_id, track_query):
    tokens = get_user_tokens(session_id)
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + tokens.access_token
    }
    endpoint = "https://api.spotify.com/v1/search/?q=" + track_query + "&type=track";
    response = get(endpoint, {}, headers=headers)
    try:
        return response.json()
    except Exception as e:
        return {'Error': f'issue with request, {e}'}

def add_to_queue(session_id, track_uri):
    return execute_spotify_api_request(session_id, f'player/queue?uri={track_uri}', post_=True)


def get_user_name(session_id):
    tokens = get_user_tokens(session_id)
    if not tokens:
        return None
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + tokens.access_token
    }
    endpoint = "https://api.spotify.com/v1/me"
    response = get(endpoint, {}, headers=headers)
    try:
        return response.json()
    except Exception as e:
        return {'Error': f'issue with request, {e}'}

