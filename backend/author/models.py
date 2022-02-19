from django.db import models

# For when we have more setup, create upload location
# def upload_path(instance, filename):
#     return '/'.join(['authors', str(instance.creator), filename])

class Author(models.Model):
        type = models.TextField()
        url = models.URLField(blank=True)
        host = models.URLField(blank=True)
        displayName = models.TextField()
        github = models.URLField()
        profileImage = models.ImageField(blank=True, null=True) # Implement upload location later `upload_to=upload_path`

# Return name for now
def __str__(self):
    return self.displayName
