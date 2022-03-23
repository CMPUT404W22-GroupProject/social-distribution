from django.db import models
from author.models import Author
import uuid
from django.utils import timezone
from django.conf import settings

class Follower(models.Model):
    type = models.TextField(default="followers")
    author = models.OneToOneField(settings.AUTH_USER_MODEL, related_name="author", on_delete=models.CASCADE)
    items = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name="followers")

class FollowRequest(models.Model):
    type = models.CharField(default="follow", max_length=6, editable=False)
    summary = models.CharField(max_length=255)
    actor = models.ForeignKey(Author, related_name="actor", on_delete=models.CASCADE)
    object = models.ForeignKey(Author, related_name="object", on_delete=models.CASCADE)