from author.models import Author
from rest_framework.serializers import ModelSerializer, SerializerMethodField
from django.http import HttpRequest
import os
import json

# Basic Author Serializer
class AuthorsSerializer(ModelSerializer):
    class Meta:
        model = Author
        fields = ("type", "id", "host", "displayName", "url", "github", "profileImage")

    id = SerializerMethodField()
    host = SerializerMethodField()
    url = SerializerMethodField()

    def get_id(self, author):
        try:    
            request = self.context.get('request')
            host = request.build_absolute_uri().split('/authors/')[0]
            return host + '/authors/' + str(author.uuid)
        except:
            return {}
    
    def get_url(self, author):
        try:    
            request = self.context.get('request')
            host = request.build_absolute_uri().split('/authors/')[0]
            return host + '/authors/' + str(author.uuid)
        except:
            return {}
    
    def get_host(self, author):
        try:    
            request = self.context.get('request')
            host = request.build_absolute_uri().split('authors')[0]
            return host
        except:
            return {}

    def create(self, validated_data):
        # Create author so we can get unique ID for URL + Host
        new_author = Author.objects.create(**validated_data)
        return new_author

    def update(self, instance, validated_data):
        # Only update the following fields
        instance.displayName = validated_data.get('displayName', instance.displayName)
        instance.github = validated_data.get('github', instance.github)

        # Handle image change (delete old off filebase)
        old_image = instance.profileImage
        instance.profileImage = validated_data.get('profileImage', old_image)
        # check if new image was given
        if instance.profileImage != old_image:
            # delete old image
            if old_image and os.path.isfile(old_image.path):
                os.remove(old_image.path)
        instance.save()
        
        return instance 