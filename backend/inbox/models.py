from django.db import models
from author.models import Author

from like.models import Like
from post.models import Post
from comment.models import Comment
from django.utils import timezone
from follower.models import FollowRequest

# Create your models here.
class Inbox(models.Model):
    type = models.TextField(default="inbox")
    like_object = models.ForeignKey(Like, blank=True, on_delete=models.CASCADE, null=True)
    post_object = models.ForeignKey(Post, blank=True, on_delete=models.CASCADE, null=True)
    comment_object = models.ForeignKey(Comment, blank=True, on_delete=models.CASCADE, null=True)
    follow_request_object = models.ForeignKey(FollowRequest, blank=True, on_delete=models.CASCADE, null=True)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    created_date = models.DateTimeField(default=timezone.now)

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
    def create_object_from_post(cls, post, author_id):
        inbox = cls(type="inbox", author_id = author_id, post_object = post)
        inbox.save()
        return inbox


    @classmethod
    def create_object_from_comment(cls, comment, author_id):
        inbox = cls(type="inbox", author_id = author_id, comment_object = comment)
        inbox.save()
        return inbox

    @classmethod
    def create_object_from_follow_request(cls, follow_request, author_id):
        inbox = cls(type="inbox", author_id=author_id, follow_request_object=follow_request)
        inbox.save()
        return inbox