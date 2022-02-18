from distutils.command.upload import upload
from nturl2path import url2pathname
from statistics import mode
from django.db import models
from django.forms import ImageField

# For when we have more setup, create upload location
# def upload_path(instance, filename):
#     return '/'.join(['authors', str(instance.creator), filename])

class Author(models.Model):
        type = models.TextField()
        url = models.URLField()
        host = models.URLField()
        displayName = models.TextField()
        github = models.URLField()
        profileImage = ImageField(blank=True, null=True) # Implement upload location later `upload_to=upload_path`

# Return name for now
def __str__(self):
    return self.name
