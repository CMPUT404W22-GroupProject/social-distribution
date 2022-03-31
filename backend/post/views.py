from django.shortcuts import render
from django.http import HttpResponse, Http404, request
from post.models import Post
from author.models import Author
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from .pagination import PostPageNumberPagination
from rest_framework import permissions
import os
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAuthorOrReadOnly
from rest_framework import generics, permissions
import json
from urllib.parse import urlparse
import requests
import uuid
from node.models import Node

from post.serializers import PostSerializer, PostSerializerGet
from node.authentication import BasicAuthentication


class PostList(ListCreateAPIView):

    serializer_class = PostSerializer
    pagination_class = PostPageNumberPagination
    author_id = None
    basic_auth = BasicAuthentication()
    # permission_classes = (IsAuthorOrReadOnly,)

    def get_queryset(self):
        return Post.objects.filter(author_id=self.author_id).order_by('published')

    # get recent posts of author
    def list(self, request, author_id):
        response = self.basic_auth.remote_request(request)
        if response:
            return response

        try:
            Author.objects.get(pk=author_id)

            self.author_id = author_id
            queryset = self.filter_queryset(self.get_queryset())
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer =  PostSerializerGet(page, many=True, context={'request':request})
                return self.get_paginated_response(serializer.data)

            serializer =  PostSerializerGet(queryset, many=True, context={'request':request})
            return Response(serializer.data, status=200)
        
        except Author.DoesNotExist:
            return Response("Post not found", status=404)
    # create a new post
    def create(self, request, author_id):
        # response = self.basic_auth.local_request(request)
        # if response:
        #     return response
        
        # if not request.user.is_authenticated or author_id != request.user.uuid:
        #     return Response("Forbidden", status=403)

        try:
            author = Author.objects.get(pk=author_id)
        except Author.DoesNotExist:
            return Response("Author not found", status=404)

        request_data = request.data.copy()

        try:
            sender_id = request_data['author']['id']
            sender_uuid = uuid.UUID(sender_id.split('/authors/')[1].split('/')[0])

            if author_id != sender_uuid:
                return Response("Bad request", status=400)

            request_data['author'] = sender_uuid

            serializer = PostSerializer(data = request_data, context={'request':request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status = 201)
            else:
                return Response(serializer.errors, status = 400) # bad request
        except:
            return Response("Bad request", status=400)

class PostDetails(APIView):
    # get post
    # permission_classes = [IsAuthenticated]
    basic_auth = BasicAuthentication()
    
    def get(self, request, post_id, author_id):
        response = self.basic_auth.remote_request(request)
        if response:
            return response

        try:
            post = Post.objects.filter(author_id=author_id).get(pk=post_id)
            serializer = PostSerializerGet(post, context={'request':request})
            return Response(serializer.data, status=200)
        except Post.DoesNotExist:
            return Response("Post not found", status=404)
        
    #TODO add authentication
    # edit post
    def put(self, request, post_id, author_id):
        response = self.basic_auth.local_request(request)
        if response:
            return response
        
        if not request.user.is_authenticated or author_id != request.user.uuid:
            return Response("Forbidden", status=403)

        try:
            author = Author.objects.get(pk=author_id)
        except Author.DoesNotExist:
            return Response("Author not found", status=404)
        
        try: 
            post = Post.objects.filter(author_id=author_id).get(pk=post_id)
        except Post.DoesNotExist:
            return Response("Post not found", status=404)

        request_data = request.data.copy()

        try:
            sender_id = request_data['author']['id']
            sender_uuid = uuid.UUID(sender_id.split('/authors/')[1].split('/')[0])

            if author_id != sender_uuid:
                return Response("Bad request", status=400)

            request_data['author'] = sender_uuid

            serializer = PostSerializer(post, data = request_data, context={'request':request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status = 201)
            else:
                return Response(serializer.errors, status = 400) # bad request
        except:
            return Response("Bad request", status=400)
    

    # delete post
    def delete(self, request, post_id, author_id):
        response = self.basic_auth.local_request(request)
        if response:
            return response

        if not request.user.is_authenticated or author_id != request.user.uuid:
            return Response("Forbidden", status=403)

        try:
            post = Post.objects.filter(author_id=author_id).get(pk=post_id)
            post.delete()
            return Response("Post deleted.", status=204)
        except Post.DoesNotExist:
            return Response("Post not found", status = 404)


    # create new post with post_id
    def post(self, request, post_id, author_id):
        response = self.basic_auth.local_request(request)
        if response:
            return response

        if not request.user.is_authenticated or author_id != request.user.uuid:
            return Response("Forbidden", status=403)
            
        try: 
            Author.objects.get(pk=author_id)
        except Author.DoesNotExist:
            return Response("Author not found", status=404)

        try:
            Post.objects.filter(author_id=author_id).get(pk=post_id)
            return Response("Not right method", status=400)
        except Post.DoesNotExist:
            serializer = PostSerializer(data = request.data, context={'request':request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status = 201)
            else:
                return Response(serializer.errors, status = 400) # bad request

class ImagePostDetails(APIView):
    basic_auth = BasicAuthentication()
    def get(self, request, post_id, author_id):
        response = self.basic_auth.remote_request(request)
        if response:
            return response

        try:
            post = Post.objects.filter(author_id=author_id).get(pk=post_id)
        except Post.DoesNotExist:
            return Response("Post not found", status=404)

        if 'image' in post.contentType:
            if post.visibility.upper() != "PUBLIC":
                return Response("Post not public", status=404)
            image_content = post.content
            return Response(image_content, status=200)
        else:
            return Response("No image", status=404)
