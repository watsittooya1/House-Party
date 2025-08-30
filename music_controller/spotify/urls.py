from django.urls import path
from .views import *


urlpatterns = [
    # redirect after auth
    path('redirect', spotify_callback),
    
    path('username', UsernameView.as_view()),
    
    # path('get-auth-url', AuthUrlView.as_view()),
    path('auth-url', AuthUrlView.as_view()),

    path('host-token', HostTokenView.as_view()),
    
    path('current-track', CurrentTrackView.as_view()),
    path('pause', PauseSongView.as_view()),
    path('play', PlaySongView.as_view()),
    path('skip', SkipSongView.as_view()),
    
    #path('get-queue', GetQueue.as_view()),
    #path('add-to-queue', QueueView.as_view()),
    path('queue', QueueView.as_view()),
    
    #path('search-track', SearchTrack.as_view()),
    path('search', SearchView.as_view()),
    ]