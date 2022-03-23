from author.models import Author
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework.serializers import ModelSerializer, SerializerMethodField
from django.contrib.auth import authenticate
import os


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
        request = self.context.get('request')

        host = request.build_absolute_uri().split('/authors/')[0]

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
        author = Author.objects.create_user(
            validated_data['email'],
            validated_data['password'],
        )
        author.displayName = validated_data['displayName']
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