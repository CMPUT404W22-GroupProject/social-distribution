from author.models import Author
from rest_framework.serializers import ModelSerializer
from django.http import HttpRequest

# Basic Author Serializer
class AuthorsSerializer(ModelSerializer):
    class Meta:
        model = Author
        fields = "__all__"

    def create(self, validated_data):
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
        return new_author

    def update(self, instance, validated_data):
        # Only update the following fields
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