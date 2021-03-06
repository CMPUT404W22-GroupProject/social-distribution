from importlib.resources import path
from re import L
from django.shortcuts import render
from django.http import HttpResponse
from author.models import Author
from author.serializers import AuthorsSerializer
from post.models import Post
from comment.models import Comment
from like.models import Like
from rest_framework.views import APIView
from rest_framework.response import Response
from like.serializers import LikeSerializer, LikeSerializerGet
import requests
from urllib.parse import urlparse
import uuid
import collections
from node.authentication import BasicAuthentication

# Create your views here.
class LikeList(APIView):
    basic_auth = BasicAuthentication()

    # Get all Likes, for all authors
    def checkErors(self, author_id, post_id, comment_id):
        try:
            Author.objects.get(pk=author_id)
        except Author.DoesNotExist:
            return HttpResponse("Author not found", status=404)
        try:
            Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return HttpResponse("Post not found", status=404)
        try:
            if comment_id!="":
                Comment.objects.get(pk=comment_id)
        except Comment.DoesNotExist:
            return HttpResponse("Comment not found", status=404)


    def get(self, request, author_id, post_id, comment_id=""): 
        response = self.basic_auth.remote_request(request)
        if response:
            return response

        # self.checkErors(author_id,post_id, comment_id)
        full_url = request.build_absolute_uri()
        url = full_url.split('/like')[0]

        all_likes = Like.objects.filter(object=url)
        if not all_likes:
            return Response({}, status=200)
            
        serializer = LikeSerializerGet(all_likes, many=True, context={'request': request})
        result = []
        for each in serializer.data:
            update = collections.OrderedDict([('@context', v) if k == 'context' else (k, v) for k, v in each.items()])
            result.append(update)

        return Response(result, status = 200)


    # Add a like object FOR POSTS
    # def post(self, request, author_id, post_id, comment_id=""):
    #     # self.checkErors(author_id,post_id, comment_id)
    #     # Mutable copy
    #     # response = self.basic_auth.remote_request(request)
    #     # if response:
    #     #     return response

    #     request_data = request.data.copy()
    #     try:
    #         print("okaydjksgfhbfhgksnmbhvfgjknmbhjk")
    #         request_id = request_data['object']
    #         Post.objects.get(id=request_id)
    #     except Post.DoesNotExist:
    #         try:
    #             Comment.objects.get(id=request_id)
    #         except:
    #             return Response("Object doesn't exist", status=404)
        
    #     try:
    #         author_data = request_data['author']
    #         author_url = author_data['id']
    #         # pathname = urlparse(author_url).path
    #         # author_uuid = uuid.UUID(pathname.split('authors/')[1])
    #         # author = Author.objects.get(uuid=author_uuid)
    #         request_data['author'] = author_url
    #     except:
    #         return Response("Author info not found", status=404)

    #     serializer = LikeSerializer(data = request_data, context={'request': request})
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status = 201)
    #     else:
    #         return Response(serializer.errors, status = 400)

class LikeDetails(APIView):
    basic_auth = BasicAuthentication()

    # We require a author_id, post_id, and/or comment_id to be passed with the request (in the url) to get a like object
    def checkErrors(self, author_id, post_id, like_id, comment_id=""):
        try:
            Author.objects.get(pk=author_id)
        except Author.DoesNotExist:
            return HttpResponse("Author not found", status=404)
        try:
            Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return HttpResponse("Post not found", status=404)
        try:
            if comment_id!="":
                Comment.objects.get(pk=comment_id)
        except Comment.DoesNotExist:
            return HttpResponse("Comment not found", status=404)
        try:
            Like.objects.get(pk=like_id)
        except Like.DoesNotExist:
            return HttpResponse("Like not found", status=404)

    def get(self, request, author_id, post_id, like_id, comment_id=""):
        response = self.basic_auth.remote_request(request)
        if response:
            return response

        # self.checkErrors(author_id, post_id, like_id, comment_id)
        url = request.build_absolute_uri()

        try:
            like = Like.objects.get(id=url)
            serializer = LikeSerializerGet(like,  context={'request': request})
            update = collections.OrderedDict([('@context', v) if k == 'context' else (k, v) for k, v in serializer.data.items()])
            return Response(update, status=200)
            
        except Like.DoesNotExist:
            return Response("Like not found", status=404)


    #Unlike a post or comment
    def delete(self, request, author_id, post_id, like_id, comment_id=""):
        response = self.basic_auth.remote_request(request)
        if response:
            return response
        
        # self.checkErrors(author_id, post_id, like_id, comment_id)
        # INCLUDE PERMISSION CHECKS BEFORE DOING THIS
        try:
            like = Like.objects.get(pk=like_id)
            like.delete()
            return Response("Successfully unliked", status=204)
        except  Like.DoesNotExist:
            return Response("Like object not found.", status=401) 


class LikedDetails(APIView):
    basic_auth = BasicAuthentication()

    def get(self, request, author_id):
        response = self.basic_auth.remote_request(request)
        if response:
            return response

        all_liked = Like.objects.filter(author_id=author_id)
        if not all_liked:
            return Response("This author hasn't liked anything yet", status=404)

        serializer = LikeSerializerGet(all_liked, many=True, context={'request': request})
        items = []
        for each in serializer.data:
            update = collections.OrderedDict([('@context', v) if k == 'context' else (k, v) for k, v in each.items()])
            items.append(update)

        result = {}
        result['type'] = "liked"
        result['items'] = items

        return Response(result, status = 200)