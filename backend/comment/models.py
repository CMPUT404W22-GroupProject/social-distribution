from django.db import models
import uuid
# from author.models import Author
# from post.models import Post

class Comment(models.Model):
    type = models.CharField(default="comment", max_length=10)
    author = models.ForeignKey('author.Author', related_name="comment_author", on_delete=models.DO_NOTHING)
    comment = models.CharField(max_length=255)
    contentType = models.CharField(max_length=255)
    published = models.DateTimeField()
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # id = models.URLField(primary_key=True)
    post = models.ForeignKey('post.Post', related_name="comment_post", on_delete=models.CASCADE)
