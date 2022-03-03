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

    def get_id(self, author):
        request = self.context.get('listRequest')
        if request:
            return request.build_absolute_uri() + str(author.uuid)
        else:
            request = self.context.get('detailsRequest')
            return request.build_absolute_uri()
    
    def get_host(self, author):
        request = self.context.get('listRequest')
        if not request:
            request = self.context.get('detailsRequest')
        host = request.build_absolute_uri().split("authors")[0]
        return host

    def create(self, validated_data):
        # Create author so we can get unique ID for URL + Host
        new_author = Author.objects.create(**validated_data)

        # Gather host
        # May require tweaking, full_path might not be the way
        request = self.context.get('listRequest')
        if not request:
            request = self.context.get('detailsRequest')
        host = request.build_absolute_uri().split("authors")[0]

        if host == "":
            host = 'http://127.0.0.1:8000/'

        # Build URL
        url = host + "authors/" + str(new_author.uuid)
        
        # Update Author object
        new_author.url = url
        new_author.host = host
        new_author.save()
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