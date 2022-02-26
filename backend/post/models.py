from distutils.command.upload import upload
from typing import List
from django.db import models
from author.models import Author


# Create your models here.
class Post(models.Model):
    type = models.TextField(default="post")
    title = models.CharField(max_length=255)
    source = models.URLField(blank=True) #TODO we are not gonna implement share feature for part 1 so this will be the same as id
    origin = models.URLField(blank=True) #TODO same as id
    description = models.TextField()
    contentType = models.CharField(max_length=255)
    content = models.TextField() #TODO does backend handle this?
    author = models.ForeignKey(Author, related_name="posts", on_delete=models.CASCADE) # when Author is deleted, Post will be deleted
    categories = models.TextField()
    count = models.PositiveBigIntegerField()
    comments = models.URLField() # first page of comments
    # commentsSrc = models.ManyToManyField(Comment, blank=True)
    published = models.DateTimeField()
    visibility = models.CharField(max_length=255)
    unlisted = models.BooleanField()

