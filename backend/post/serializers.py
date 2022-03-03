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

# Basic Post Serializer
class PostSerializer(ModelSerializer):
    # author = AuthorsSerializer(many=False, read_only=True)
    # author = ReadOnlyField(source='author.id')
    commentsSrc = SerializerMethodField()
    id = SerializerMethodField()
    comments = SerializerMethodField()
    count = SerializerMethodField()

    class Meta:
        model = Post
        fields = ('type', 'title', 'id', 'source', 'origin', 'description', 'contentType', 'content', 'author', 'categories', 'count', 
                    'comments', 'commentsSrc', 'published', 'visibility', 'unlisted')
                    
    def get_id(self, post):
        request = self.context.get('listRequest')
        if request:
            return request.build_absolute_uri() + str(post.uuid)
        else:
            request = self.context.get('detailsRequest')
            return request.build_absolute_uri()

    def get_comments(self, post):
        request = self.context.get('listRequest')
        if request:
            return request.build_absolute_uri() + str(post.uuid) + '/comments'
        else:
            request = self.context.get('detailsRequest')
            return request.build_absolute_uri() + 'comments'
    
    def get_commentsSrc(self, post):
        try:
            request = self.context.get('listRequest')
            if request:
                url = request.build_absolute_uri() + str(post.uuid) + '/comments'
            else:
                request = self.context.get('detailsRequest')
                url = request.build_absolute_uri() + 'comments'
            response = requests.get(url).json()
            return response
        except:
            return {}

    def get_count(self, post):
        return Comment.objects.filter(post=post.uuid).count()

    def create(self, validated_data):
        new_post = Post.objects.create(**validated_data)
        Inbox.create_object_from_post(new_post) #Send post to inbox
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
