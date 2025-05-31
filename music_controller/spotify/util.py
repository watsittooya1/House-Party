from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import CLIENT_ID, CLIENT_SECRET
from requests import post

SPOTIFY_BASE_URL = "https://api.spotify.com/v1/me/"

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

def prepare_headers(session_id):
    tokens = get_user_tokens(session_id)
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + tokens.access_token
    }
