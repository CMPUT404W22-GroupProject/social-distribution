from django.db import models
from author.models import Author

class Like(models.Model):
        context = models.TextField(default="https://www.w3.org/ns/activitystreams")
        summary = models.TextField(blank=True)
        type = models.TextField(default="Like")
        author = models.ForeignKey(Author, on_delete=models.CASCADE)
        # object = models.ForeignKey(Post, on_delete=models.CASCADE) for post
        # object for comments

'''
{
"author" : 1
}
'''