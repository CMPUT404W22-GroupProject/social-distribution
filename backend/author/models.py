from statistics import mode
from django.db import models
from .managers import AccountManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db.models.signals import post_delete
from django.dispatch.dispatcher import receiver
import uuid
import os

# For when we have more setup, create upload location
def upload_path(instance, filename):
    return '/'.join(['profileImages', str(instance.uuid), filename])

class Author(AbstractBaseUser, PermissionsMixin):
    type = models.TextField(default="author")
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    displayName = models.CharField(max_length=150)
    url = models.URLField(blank=True)
    host = models.URLField(blank=True)
    github = models.URLField()
    profileImage = models.ImageField(blank=True, null=True, upload_to=upload_path)
    is_staff = models.BooleanField(default=False)
    # is_auth = models.BooleanField(default=False) # ADMIN MUST MANUALLY AUTHENTICATE
    is_active = models.BooleanField(default=True)

    objects = AccountManager()

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['displayName']

    #The following are used in Like app
    def __str__(self):
        return str(self.uuid)

    def toString(self):
        return {"type: ":self.type,
                "host: ":self.host,
                "displayName: " :self.displayName,
                "url: ": self.url,
                "github: ":self.github,
                "id": self.uuid}

    # def get_full_name(self):
    #     return self.name

    # def get_short_name(self):
    #     return self.name.split()[0]

@receiver(post_delete, sender=Author)
def recipe_image_delete(sender, instance, **kwargs):
    if instance.profileImage:
        instance.profileImage.delete(False)
