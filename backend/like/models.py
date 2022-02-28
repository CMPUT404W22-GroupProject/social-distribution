from django.db import models
from author.models import Author
from post.models import Post
from comment.models import Comment
class Like(models.Model):
        context = models.TextField(default="https://www.w3.org/ns/activitystreams")
        summary = models.TextField(blank=False, null=False, default="Must follow the format below!\nExample1: \"Author1 likes your post\" \nExample2: \"Author2 likes your comment\"\nReplace author name and choose whether it's a comment/post.")
        type = models.TextField(default="Like")
        author = models.ForeignKey(Author, on_delete=models.CASCADE, default=1)
        object = models.ForeignKey(Post, on_delete=models.CASCADE,blank=True, null=True) #Post
        object1 = models.ForeignKey(Comment, on_delete=models.CASCADE,blank=True, null=True) #Comment
