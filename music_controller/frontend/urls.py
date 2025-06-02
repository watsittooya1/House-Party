from django.urls import path
from .views import index

app_name = 'frontend'

urlpatterns = [
    # this name='' needed for spotify app to redirect here
    path('', index, name=''),
    path('join', index),
    path('info', index),
    path('create', index),
    # Django dynamic url
    path('room/<str:roomCode>', index)
]
