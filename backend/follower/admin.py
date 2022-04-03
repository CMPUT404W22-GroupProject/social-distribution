from django.contrib import admin
from .models import Follower, FollowRequest

admin.site.register(Follower)
admin.site.register(FollowRequest)