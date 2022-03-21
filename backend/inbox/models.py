from django.db import models
from author.models import Author

from like.models import Like
from post.models import Post
from comment.models import Comment
# Create your models here.
class Inbox(models.Model):
    type = models.TextField(default="inbox")
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    
    like_object = models.ForeignKey(Like, on_delete=models.CASCADE,blank=True, null=True)
    post_object = models.ForeignKey(Post, on_delete=models.CASCADE,blank=True, null=True)
    comment_object = models.ForeignKey(Comment, on_delete=models.CASCADE,blank=True, null=True)


    @classmethod
    def create_object_from_like(cls, like):
        if not like.object1:
            # if its a like on a post
            inbox = cls(type="inbox", author = like.object.author, like_object = like)
        else:
            # if its a like on a comment
            inbox = cls(type="inbox", author = like.object1.author, like_object = like)
        inbox.save()
        return inbox


    @classmethod
    def create_object_from_post(cls, post):
        inbox = cls(type="inbox", author = post.author, post_object = post)
        inbox.save()
        return inbox


    @classmethod
    def create_object_from_comment(cls, comment):
        inbox = cls(type="inbox", author = comment.author, comment_object = comment)
        inbox.save()
        return inbox