from django.db import models

# For when we have more setup, create upload location
def upload_path(instance, filename):
    return '/'.join(['profileImages', str(instance.id), filename])

class Author(models.Model):
        type = models.TextField(default="author")
        url = models.URLField(blank=True)
        host = models.URLField(blank=True )
        displayName = models.TextField()
        github = models.URLField()
        # profileImage = models.ImageField(blank=True, null=True, upload_to=upload_path) # Implement upload location later `upload_to=upload_path`

