from django.db import models
from author.models import Author

from like.models import Like
from post.models import Post

# Create your models here.
class Inbox(models.Model):
    type = models.TextField(default="inbox")
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    like_object = models.ForeignKey(Like, on_delete=models.CASCADE,blank=True, null=True)
    post_object = models.ForeignKey(Post, on_delete=models.CASCADE,blank=True, null=True)




    @classmethod
    def create_object_from_like(cls, like):
        inbox = cls(type="inbox", author = like.author, like_object = like)
        inbox.save()
        return inbox


    @classmethod
    def create_object_from_post(cls, post):
        inbox = cls(type="inbox", author = post.author, post_object = post)
        inbox.save()
        return inbox