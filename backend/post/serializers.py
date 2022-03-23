from tkinter import E
from inbox.models import Inbox
from post.models import Post
from rest_framework.serializers import ModelSerializer, SerializerMethodField, ReadOnlyField
from author.serializers import AuthorsSerializer
import os
import json
import requests
from comment.views import CommentList
from django.urls import path
from comment.models import Comment
from author.models import Author
import uuid
from requests.auth import HTTPBasicAuth
from comment import views
from urllib3.exceptions import InsecureRequestWarning

# Basic Post Serializer
class PostSerializer(ModelSerializer):
    # author = AuthorsSerializer(many=False, read_only=True)
    commentsSrc = SerializerMethodField()
    id = SerializerMethodField()
    comments = SerializerMethodField()
    count = SerializerMethodField()
    author = SerializerMethodField()

    class Meta:
        model = Post
        fields = ('type', 'title', 'id', 'source', 'origin', 'description', 'contentType', 'content', 'author', 'categories', 'count', 
                    'comments', 'commentsSrc', 'published', 'visibility', 'unlisted')
                    
    def get_id(self, post):
        request = self.context.get('request')
        url_no_id = request.build_absolute_uri().split('/posts/')[0]
        return url_no_id + '/posts/' + str(post.uuid)

    def get_comments(self, post):
        request = self.context.get('request')
        url_no_id = request.build_absolute_uri().split('/posts/')[0]
        return url_no_id + '/posts/' + str(post.uuid) + '/comments'

    
    def get_commentsSrc(self, post):
        try:
            request = self.context.get('request')
            response = CommentList.as_view()(request=request._request, author_id=post.author.uuid, post_id=post.uuid).data
            return response
        except Exception as e:
            return {}

    def get_count(self, post):
        return Comment.objects.filter(post=post.uuid).count()
    
    def get_author(self, post):
        request = self.context.get('request')
        # request_uuid = uuid.UUID(str(request.user))
        request_uuid = str(request).split('/posts/')[0].split('authors/')[1]
        author = Author.objects.get(pk=request_uuid)
        serializer = AuthorsSerializer(author, context={'request':request})
        return serializer.data

    def create(self, validated_data):
        new_post = Post.objects.create(**validated_data)
        # Inbox.create_object_from_post(new_post) #Send post to inbox
        return new_post

    def update(self, instance, validated_data):

        # update the following fields
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.categories = validated_data.get('categories', instance.categories)
        instance.content = validated_data.get('content', instance.content)
        instance.visibility = validated_data.get('visibility', instance.visibility)
        instance.unlisted = validated_data.get('unlisted', instance.unlisted)

        instance.save()
        
        return instance
