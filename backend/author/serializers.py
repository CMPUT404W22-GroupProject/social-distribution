from author.models import Author
from rest_framework.serializers import ModelSerializer
from django.http import HttpRequest
import os
import json

# Basic Author Serializer
class AuthorsSerializer(ModelSerializer):
    class Meta:
        model = Author
        fields = ('type', 'url', 'host', 'displayName', 'github')

    def create(self, validated_data):
        # Create author so we can get unique ID for URL + Host
        new_author = Author.objects.create(**validated_data)

        # Gather host
        # May require tweaking, full_path might not be the way
        try:
            host = HttpRequest.request.get_full_path()

        except:
            host = 'http://127.0.0.1:8000/'

        # Build URL
        url = host + str(new_author.id)
        
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
        # old_image = instance.profileImage
        # instance.profileImage = validated_data.get(' profileImage', old_image)
        # # check if new image was given
        # if instance.profileImage != old_image:
        #     # delete old image
        #     if old_image and os.path.isfile(old_image.path):
        #         os.remove(old_image.path)
        instance.save()
        
        return instance 