from django.db import models
from author.models import Author
import uuid
from django.utils import timezone
from django.conf import settings

class Follower(models.Model):
    type = models.TextField(default="followers")
    author = models.OneToOneField(settings.AUTH_USER_MODEL, related_name="author", on_delete=models.CASCADE)
    items = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name="followers")