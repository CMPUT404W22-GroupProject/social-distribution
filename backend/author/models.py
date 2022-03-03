from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
import uuid

# For when we have more setup, create upload location
def upload_path(instance, filename):
    return '/'.join(['profileImages', str(instance.id), filename])

# class Author(models.Model):
#     type = models.TextField(default="author")
#     url = models.URLField(blank=True)
#     host = models.URLField(blank=True )
#     displayName = models.TextField()
#     github = models.URLField()
#         # profileImage = models.ImageField(blank=True, null=True, upload_to=upload_path) # Implement upload location later `upload_to=upload_path`


#     #The following are used in Like app
#     def __str__(self):
#         return self.type+","+self.host+","+self.displayName+","+self.url+","+self.github

#     def toString(self):
#         return {"type: ":self.type,
#                 "host: ":self.host,
#                 "displayName: " :self.displayName,
#                 "url: ": self.url,
#                 "github: ":self.github}

class AccountManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, displayName, password, **extra_fields):
        values = [email, displayName]
        field_value_map = dict(zip(self.model.REQUIRED_FIELDS, values))
        for field_name, value in field_value_map.items():
            if not value:
                raise ValueError('The {} value must be set'.format(field_name))

        email = self.normalize_email(email)
        user = self.model(
            email=email,
            displayName=displayName,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, displayName, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, displayName, password, **extra_fields)

    def create_superuser(self, email, displayName, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self._create_user(email, displayName, password, **extra_fields)

class Author(AbstractBaseUser, PermissionsMixin):
    type = models.TextField(default="author")
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    displayName = models.CharField(max_length=150)
    url = models.URLField(blank=True)
    host = models.URLField(blank=True )
    github = models.URLField()
    is_staff = models.BooleanField(default=False)

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
                "github: ":self.github}

    # def get_full_name(self):
    #     return self.name

    # def get_short_name(self):
    #     return self.name.split()[0]