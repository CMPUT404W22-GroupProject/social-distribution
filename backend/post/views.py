from django.shortcuts import render
from django.http import HttpResponse, Http404, request
from post.models import Post
from author.models import Author
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination, PageNumberPagination
from django.contrib.auth.mixins import LoginRequiredMixin
from .pagination import PostPageNumberPagination
from rest_framework import permissions
import os
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAuthorOrReadOnly
from rest_framework import generics, permissions

from post.serializers import PostSerializer

class PostList(ListCreateAPIView):

    serializer_class = PostSerializer
    pagination_class = PostPageNumberPagination
    author_id = None
    # permission_classes = (permissions.IsAuthenticated,)
    permission_classes = (IsAuthorOrReadOnly,)
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Post.objects.filter(author_id=self.author_id).order_by('published')

    # get recent posts of author
    def list(self, request, author_id):
        self.author_id = author_id
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer =  PostSerializer(page, many=True, context={'request':request})
            return self.get_paginated_response(serializer.data)
        serializer =  PostSerializer(queryset, many=True, context={'request':request})
        return Response(serializer.data, status=200)

    # create a new post
    def create(self, request, author_id):
        try:
            author = Author.objects.get(pk=author_id)
        except Author.DoesNotExist:
            return HttpResponse("Author", status=404)

        # if request.data.get('author') != author:
        #     print(request.data)
        #     return Response("You cannot make a post for this URL", status=400)
        serializer = PostSerializer(data = request.data, context={'request':request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = 201)
        else:
            return Response(serializer.errors, status = 400) # bad request


class PostDetails(APIView):
    # get post
    # permission_classes = [IsAuthenticated]
    permission_classes = (IsAuthorOrReadOnly,)
    def get(self, request, post_id, author_id):
        try:
            post = Post.objects.filter(author_id=author_id).get(pk=post_id)
            serializer = PostSerializer(post, context={'request':request})
            return Response(serializer.data, status=200)
        except Post.DoesNotExist:
            return HttpResponse("Post not found", status = 401)
        
    #TODO add authentication
    # edit post
    def post(self, request, post_id, author_id):
        # if request.data.get('author') != str(author_id):
        #     return Response("You cannot make a post for this URL", status=400)
        try: 
            post = Post.objects.filter(author_id=author_id).get(pk=post_id)
            serializer = PostSerializer(post, data = request.data, context={'request':request})
        except Post.DoesNotExist:
            return HttpResponse("Post not found.", status=401)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = 201)
        else:
            return Response(serializer.errors, status = 400) # bad request
    

    # delete post
    def delete(self, request, post_id, author_id):
        try:
            post = Post.objects.filter(author_id=author_id).get(pk=post_id)
            post.delete()
            return Response("Post deleted.", status=204)
        except Post.DoesNotExist:
            return HttpResponse("Post not found", status = 401)


    # create new post with post_id
    def put(self, request, post_id, author_id):
        try: 
            Author.objects.get(pk=author_id)
        except Author.DoesNotExist:
            return HttpResponse("Author not found.", status=401)

        try:
            Post.objects.filter(author_id=author_id).get(pk=post_id)
            return HttpResponse("Not right method", status=400)
        except Post.DoesNotExist:
            serializer = PostSerializer(data = request.data, context={'request':request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status = 201)
            else:
                return Response(serializer.errors, status = 400) # bad request

# class ImagePostDetails(APIView):
#     def get(self, request, post_id, author_id):
