from post.models import Post
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from django.http import HttpRequest
from author.serializers import AuthorsSerializer
from post.models import Post, Author
import os
import json

# Basic Post Serializer
class PostSerializer(ModelSerializer):
    author = AuthorsSerializer(many=False, read_only=True)
    class Meta:
        model = Post
        fields = ('type', 'title', 'source', 'origin', 'description', 'contentType',
                    'content', 'author', 'categories', 'count', 'comments', 'published', 'visibility', 'unlisted')

    def create(self, validated_data):
        new_post = Post.objects.create(**validated_data)
        return new_post

    def update(self, instance, validated_data):

        # update the following fields
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.categories = validated_data.get('categories', instance.categories)
        instance.content = validated_data.get('content', instance.content)
        instance.count = validated_data.get('count', instance.count)
        instance.comments = validated_data.get('comments', instance.comments)
        instance.visibility = validated_data.get('visibility', instance.visibility)
        instance.unlisted = validated_data.get('unlisted', instance.unlisted)

        instance.save()
        
        return instance