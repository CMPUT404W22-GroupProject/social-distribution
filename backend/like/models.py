from django.db import models
from author.models import Author
from post.models import Post
from comment.models import Comment
class Like(models.Model):
        context = models.TextField(default="https://www.w3.org/ns/activitystreams")
        summary = models.TextField(blank=True)
        type = models.TextField(default="Like")
        author = models.ForeignKey(Author, on_delete=models.CASCADE, default=1)
        object = models.ForeignKey(Post, on_delete=models.CASCADE,blank=True, null=True) #Post
        object1 = models.ForeignKey(Comment, on_delete=models.CASCADE,blank=True, null=True) #Comment
