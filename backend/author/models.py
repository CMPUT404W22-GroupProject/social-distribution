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


        #The following are used in Like app
        def __str__(self):
            return self.type+","+self.host+","+self.displayName+","+self.url+","+self.github

        def toString(self):
            return {"type: ":self.type,
                    "host: ":self.host,
                    "displayName: " :self.displayName,
                    "url: ": self.url,
                    "github: ":self.github}