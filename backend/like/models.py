from django.db import models
from author.models import Author
from post.models import Post
from comment.models import Comment
class Like(models.Model):
        _id = models.AutoField(primary_key=True)
        id = models.URLField(blank=True)
        context = models.TextField(default="https://www.w3.org/ns/activitystreams")
        summary = models.TextField(blank=True, null=True)
        type = models.TextField(default="like")
        author = models.URLField()
        object = models.URLField() # object can be Post or Comment
