from author.models import Author
from rest_framework.serializers import ModelSerializer
import os

# Basic Author Serializer
class AuthorsSerializer(ModelSerializer):
    class Meta:
        model = Author
        fields = "__all__"

    
    def update(self, instance, validated_data):
        # Only update the following fields
        instance.host = validated_data.get('description', instance.description)
        instance.displayName = validated_data.get('amount', instance.amount)
        instance.github = validated_data.get('email', instance.email)

        # Handle image change (delete old off filebase)
        # !!!!! UNCOMMENT WHEN IMAGES ARE BEING STORED !!!!!
        # old_image = instance. profileImage
        # instance. profileImage = validated_data.get(' profileImage', old_image)
        # # check if new image was given
        # if instance. profileImage != old_image:
        #     # delete old image
        #     if old_image and os.path.isfile(old_image.path):
        #         os.remove(old_image.path)
        instance.save()
        
        return instance 