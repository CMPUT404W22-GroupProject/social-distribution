from django.db import models
from .managers import AccountManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db.models.signals import post_delete
from django.dispatch.dispatcher import receiver
import uuid

class Author(AbstractBaseUser, PermissionsMixin):
    type = models.TextField(default="author")
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    displayName = models.CharField(max_length=150)
    url = models.URLField(blank=True)
    host = models.URLField(blank=True)
    github = models.URLField()
    profileImage = models.TextField(blank=True)
    is_staff = models.BooleanField(default=False)
    # is_auth = models.BooleanField(default=False) # ADMIN MUST MANUALLY AUTHENTICATE

    objects = AccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['displayName']

    #The following are used in Like app
    def __str__(self):
        return self.type+","+self.host+","+self.displayName+","+self.url+","+self.github

    def toString(self):
        return {"type: ":self.type,
                "host: ":self.host,
                "displayName: " :self.displayName,
                "url: ": self.url,
                "github: ":self.github,
                "id": self.uuid}