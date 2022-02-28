from django.db import models
from author.models import Author
from post.models import Post

class Like(models.Model):
        context = models.TextField(default="https://www.w3.org/ns/activitystreams")
        summary = models.TextField(blank=True)
        type = models.TextField(default="Like")
        author = models.ForeignKey(Author, on_delete=models.CASCADE, default=1)
        object = models.ForeignKey(Post, on_delete=models.CASCADE,default="8e1d40fa-ca45-496c-a409-fcc39d5026bf")
        # object for comments
