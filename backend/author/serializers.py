from author.models import Author
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework.serializers import ModelSerializer, SerializerMethodField
from django.contrib.auth import authenticate
import os
from urllib.parse import urlparse


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
            host = self.get_host(author)
            return host + '/authors/' + str(author.uuid)
        except:
            return {}
    
    def get_url(self, author):
        try:
            host = self.get_host(author)
            return host + '/authors/' + str(author.uuid)
        except:
            return {}
    
    def get_host(self, author):
        try:    
            request = self.context.get('request')
            full_url = request.build_absolute_uri()
            parsed_uri = urlparse(full_url)
            host = '{uri.scheme}://{uri.netloc}'.format(uri=parsed_uri)
            return host
        except:
            return {}

    def create(self, validated_data):
        # Create author so we can get unique ID for URL + Host
        new_author = Author.objects.create(**validated_data)
        request = self.context.get('request')

        full_url = request.build_absolute_uri()
        parsed_uri = urlparse(full_url)

        host = '{uri.scheme}://{uri.netloc}'.format(uri=parsed_uri)

        new_author.host = host
        new_author.id = host + '/authors/' + str(new_author.uuid)
        new_author.url = host + '/authors/' + str(new_author.uuid)

        new_author.save()
        return new_author

    def ignoreMethod(self, validated_data):
        # Used in follower_api test
        new_author = Author.objects.create(**validated_data)
        host = "http://testserver"
        new_author.host = host
        new_author.id = host + '/authors/' + str(new_author.uuid)
        new_author.url = host + '/authors/' + str(new_author.uuid)

        new_author.save()
        return new_author

    def update(self, instance, validated_data):
        # Only update the following fields
        instance.displayName = validated_data.get('displayName', instance.displayName)
        instance.github = validated_data.get('github', instance.github)
        instance.profileImage = validated_data.get('profileImage', instance.profileImage)
        instance.save()
        
        return instance 

#Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=Author.objects.all())]
            )

    class Meta:
        model = Author
        fields = ('displayName', 'email', 'password', 'uuid')
        extra_kwargs = {
            'password': {'write_only':True},
            'uuid': {'read_only':True},
        }

    def create(self, validated_data):
        request = self.context.get('request')

        author = Author.objects.create_user(
            email=validated_data['email'],
            displayName=validated_data['displayName'],
            password=validated_data['password']
        )

        full_url = request.build_absolute_uri()
        parsed_uri = urlparse(full_url)

        host = '{uri.scheme}://{uri.netloc}'.format(uri=parsed_uri)

        author.host = host
        author.id = host + '/authors/' + str(author.uuid)
        author.url = host + '/authors/' + str(author.uuid)
        author.save()
        return author

#Login Serializer
class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        author = authenticate(**data)
        if author and author.is_active:
            return author
        raise serializers.ValidationError("Incorrect Credentials")