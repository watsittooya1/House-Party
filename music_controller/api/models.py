from django.db import models
import string
import random

# note: the spotify project also depends on the models
# in this file; might do well to separate the responsibilities
# or at least move these into a common models project

def generate_unique_code():
    length=6
    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Room.objects.filter(code=code).count() == 0:
            break

    return code

class Room(models.Model):
    code = models.CharField(max_length=8, default=generate_unique_code, unique=True)
    host = models.CharField(max_length=50, unique=True)
    guest_can_pause = models.BooleanField(null=False, default=False)
    guest_can_queue = models.BooleanField(null=False, default=False)
    votes_to_skip = models.IntegerField(null=False, default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    current_track = models.CharField(max_length=50, null=True)
    
class RoomMember(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    user_id = models.CharField(max_length=50, unique=True)