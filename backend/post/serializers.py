from post.models import Post
from rest_framework.serializers import ModelSerializer, HyperlinkedModelSerializer, HyperlinkedIdentityField, SerializerMethodField
from author.serializers import AuthorsSerializer
from comment.serializers import CommentSerializer
from django.http import Http404, HttpRequest, HttpResponse, HttpResponseRedirect
from comment.models import Comment
from django.shortcuts import redirect
from django.core import serializers
from django.http import JsonResponse
import urllib, json
import os
import json
from comment.views import CommentList

# class CommentSrcSerializer(ModelSerializer):
#     class Meta:
#         model = CommentSrc
#         fields = ('type', 'page', 'size', 'post', 'id', 'comments')

#     def create(self, validated_data):
#         new_comment_src = CommentSrc.objects.create(**validated_data)
#         return new_comment_src

# Basic Post Serializer
class PostSerializer(ModelSerializer):
    author = AuthorsSerializer(many=False, read_only=True)
    # commentItems = CommentSerializer(many=True, read_only=True)
    # commentSrc = Comment.objects.filter()
    commentsSrc = SerializerMethodField()
    id = SerializerMethodField()
    comments = SerializerMethodField()

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
            return request.build_absolute_uri() + str(post.uuid) + 'comments'
        else:
            request = self.context.get('detailsRequest')
            return request.build_absolute_uri() + 'comments'
    
    def get_commentsSrc(self, post):
        # qs = Comment.objects.filter(post=post)
        # serializer = CommentSerializer(instance=qs, many=True)
        request = self.context.get('listRequest')
        if request:
            url = request.build_absolute_uri() + str(post.uuid) + 'comments'
        else:
            request = self.context.get('detailsRequest')
            url = request.build_absolute_uri() + 'comments'
        # response = urllib.request.urlopen(url)
        # data = json.loads(response.read())
        response = redirect(url)
        # response =  HttpResponseRedirect(redirect_to=url)
        return "will be implemented"

    def create(self, validated_data):
        new_post = Post.objects.create(**validated_data)
        # new_post.id = request.build_absolute_uri
        # new_post.save()
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
