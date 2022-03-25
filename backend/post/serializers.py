from lib2to3.pytree import convert
# from tkinter import E
# from inbox.models import Inbox
from post.models import Post
from rest_framework.serializers import ModelSerializer, SerializerMethodField, ReadOnlyField
from author.serializers import AuthorsSerializer
import os
import json
import requests
from comment.views import CommentList
# from inbox.views import InboxList
from django.urls import path
from comment.models import Comment
from author.models import Author
import uuid
from requests.auth import HTTPBasicAuth
from comment import views
from urllib3.exceptions import InsecureRequestWarning
from follower.models import Follower
from rest_framework.request import Request
from rest_framework.test import APIRequestFactory
from rest_framework.parsers import JSONParser
from django.urls import reverse
from inbox.models import Inbox
from urllib.parse import urlparse
from node.authentication import BasicAuthentication


# Basic Post Serializer
class PostSerializer(ModelSerializer):

    commentsSrc = SerializerMethodField()
    count = SerializerMethodField()
    basic_auth = BasicAuthentication()

    class Meta:
        model = Post
        fields = ('type', 'title', 'id', 'source', 'origin', 'description', 'contentType', 'content', 'author', 'categories', 'count', 
                    'comments', 'commentsSrc', 'published', 'visibility', 'unlisted')
    
    def get_commentsSrc(self, post):
        try:
            factory = APIRequestFactory()
            temp_get_request = factory.get(post.comments, HTTP_AUTHORIZATION="Basic YWRtaW46Z3diUnF2OFpMdE0zVEZSVw==", content_type='application/json')
            converted_request = Request(temp_get_request, parsers=[JSONParser()])
            response = CommentList.as_view()(request=converted_request._request, author_id=post.author.uuid, post_id=post.uuid).data
            return response
        except Exception as e:
            return {}

    def get_count(self, post):
        return Comment.objects.filter(post=post.uuid).count()

    def create(self, validated_data):
        new_post = Post.objects.create(**validated_data)
        request = self.context.get('request')

        full_url = request.build_absolute_uri()

        url_author = full_url.split('/posts/')[0]
        new_post.id = url_author + '/posts/' + str(new_post.uuid)
        
        new_post.comments = new_post.id + '/comments'

        new_post.save()

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

class PostSerializerGet(PostSerializer):
    author = AuthorsSerializer(many=False, read_only=True)