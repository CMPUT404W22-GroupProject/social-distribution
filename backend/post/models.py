from django.db import models
from author.models import Author
from comment.models import Comment
import uuid

# Create your models here.
class Post(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.TextField(default="post")
    # id = models.CharField(max_length=255, blank=True)
    title = models.CharField(max_length=255)
    source = models.URLField(blank=True) #TODO we are not gonna implement share feature for part 1 so this will be the same as id
    origin = models.URLField(blank=True) #TODO same as id
    description = models.TextField()
    contentType = models.CharField(max_length=255)
    content = models.TextField() #TODO does backend handle this?
    author = models.ForeignKey(Author, related_name="post_author", on_delete=models.CASCADE) # when Author is deleted, Post will be deleted
    categories = models.TextField()
    count = models.PositiveBigIntegerField()
    # comments = models.URLField() # first page of comments
    # commentsSrc = models.ManyToManyField(Comment, related_name="post_commentSrc", blank=True)
    # commentItems = models.ManyToManyField(Comment, related_name="post_commentSrc", blank=True)
    published = models.DateTimeField()
    visibility = models.CharField(max_length=255)
    unlisted = models.BooleanField()

# class CommentSrc(models.Model):
#     type = models.CharField(default="comments", max_length=10)
#     page = models.PositiveBigIntegerField()
#     size = models.PositiveBigIntegerField()
#     post = models.URLField()
#     id = models.URLField(primary_key=True)
#     comments = models.ManyToManyField('comment.Comment', blank= True)