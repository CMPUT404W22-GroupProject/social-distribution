from django.shortcuts import render
from django.http import HttpResponse, Http404
from post.models import Post, Author
from rest_framework.views import APIView
from rest_framework.response import Response
import os

from post.serializers import PostSerializer

class PostList(APIView):

    # get recent posts of author
    def get(self, request, author_id):
        #TODO handle recent, pagenation
        try:
            Author.objects.get(pk=author_id)
        except Author.DoesNotExist:
            return HttpResponse("Author not found.", status=404)

        recent_posts = Post.objects.all().order_by('published')
        serializer = PostSerializer(recent_posts, many = True)
        return Response(serializer.data, status=200)

    # create a new post
    def post(self, request, author_id):
        try:
            Author.objects.get(pk=author_id)
        except Author.DoesNotExist:
            return HttpResponse("Author", status=404)

        serializer = PostSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = 201)
        else:
            return Response(serializer.errors, status = 400) # bad request

class PostDetails(APIView):
    def get_author(self, pk):
        try:
            return Author.objects.get(pk=pk)
        except Author.DoesNotExist:
            return Http404

    # get post
    def get(self, request, post_id, author_id):
        try:
            post = Post.objects.get(pk=post_id)
            serializer = PostSerializer(post)
            return Response(serializer.data, status=200)
        except Post.DoesNotExist:
            return HttpResponse("Post ahhh not found", status = 401)
        
    #TODO add authentication
    # edit post
    def post(self, request, post_id, author_id):
        try: 
            post = Post.objects.get(pk=post_id)
            serializer = PostSerializer(data = post.data)
        except Author.DoesNotExist:
            return HttpResponse("Author not found.", status=401)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = 201)
        else:
            return Response(serializer.errors, status = 400) # bad request
    

    # delete post
    def delete(self, request, post_id, author_id):
        try:
            post = Post.objects.get(pk=post_id)
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
            Post.objects.get(pk=post_id)
            return HttpResponse("Not right method", status=400)
        except Post.DoesNotExist:
            post = self.get_object(post_id)
            serializer = PostSerializer(data = post.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status = 201)
            else:
                return Response(serializer.errors, status = 400) # bad request