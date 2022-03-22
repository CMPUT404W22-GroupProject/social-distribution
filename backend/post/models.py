from django.db import models
from author.models import Author
import uuid
from django.utils import timezone
from django.conf import settings

# Create your models here.
class Post(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.CharField(default="post", max_length=4, editable=False)
    title = models.CharField(max_length=255)
    source = models.URLField(blank=True) #TODO we are not gonna implement share feature for part 1 so this will be the same as id
    origin = models.URLField(blank=True) #TODO same as id
    description = models.TextField()
    contentType = models.CharField(max_length=255)
    content = models.TextField()
    author = models.ForeignKey(Author, related_name="post_author", on_delete=models.CASCADE) # when Author is deleted, Post will be deleted
    categories = models.TextField()
    published = models.DateTimeField(default=timezone.now)
    visibility = models.CharField(max_length=255)
    unlisted = models.BooleanField()
    image = models.TextField(blank=True)
