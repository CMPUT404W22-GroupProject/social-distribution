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
from like.serializers import LikeSerializer
import requests
from urllib.parse import urlparse
import uuid
import collections

# Create your views here.
class LikeList(APIView):
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
        self.checkErors(author_id,post_id, comment_id)
        full_url = request.build_absolute_uri()
        url = full_url.split('/like')[0]
        hostname = urlparse(full_url).hostname

        # 1a. Check if like object exists on local server
        all_likes = Like.objects.filter(object=url)
        # 2. Check if like object exists on remote server
        if not all_likes:
            # 3. Invalid request
            if hostname == "localhost" or hostname == "127.0.0.1":
                return Response("Like not found", status=404)
            else:
                response = requests.get(full_url)
                if response.status_code == 200:
                    return Response(response.json(), status=200)
                else:
                    return Response("Like not found", status=404)

        # 1b. 
        serializer = LikeSerializer(all_likes, many=True, context={'request': request})
        result = []
        for each in serializer.data:
            update = collections.OrderedDict([('@context', v) if k == 'context' else (k, v) for k, v in each.items()])
            result.append(update)

        return Response(result, status = 200)

    # Add a like object FOR POSTS
    def post(self, request, author_id, post_id, comment_id=""):
        # self.checkErors(author_id,post_id, comment_id)
        # Mutable copy
        request_data = request.data.copy()
        try:
            response = requests.get(request_data['object']).json()
            if response['type'] != "post" and response['type'] != "comment":
                return Response("Object doesn't exist", status=404)
        except:
            return Response("Object doesn't exist", status=404)
        
        try:
            author_data = request_data['author']
            author_url = author_data['id']
            pathname = urlparse(author_url).path
            author_uuid = uuid.UUID(pathname.split('authors/')[1])
            author = Author.objects.get(uuid=author_uuid)
            request_data['author'] = author
        except:
            return Response("Author info not found", status=404)

        serializer = LikeSerializer(data = request_data, context={'request': request})
        if serializer.is_valid():
            serializer.save(author=author)
            return Response(serializer.data, status = 201)
        else:
            return Response(serializer.errors, status = 400)

class LikeDetails(APIView):
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
        self.checkErrors(author_id, post_id, like_id, comment_id)
        full_url = request.build_absolute_uri()
        hostname = urlparse(full_url).hostname

        try:
            # 1a. Check if like object exists on local server
            like = Like.objects.get(id=full_url)
            
        except Like.DoesNotExist:
            # 2. Check if like object exists on remote server
            # 3. Invalid request
            if hostname == "localhost" or hostname == "127.0.0.1":
                return Response("Like not found", status=404)
            else:
                response = requests.get(full_url)
                if response.status_code == 200:
                    return Response(response.json(), status=200)
                else:
                    return Response("Like not found", status=404)


        serializer = LikeSerializer(like,  context={'request': request})
        update = collections.OrderedDict([('@context', v) if k == 'context' else (k, v) for k, v in serializer.data.items()])

        return Response(update, status=200)

    #Unlike a post or comment
    def delete(self, request, author_id, post_id, like_id, comment_id=""):
        self.checkErrors(author_id, post_id, like_id, comment_id)
        # INCLUDE PERMISSION CHECKS BEFORE DOING THIS
        try:
            like = Like.objects.get(pk=like_id)
            like.delete()
            if comment_id=="":
                return HttpResponse("Successfully unliked the post.", status=204)
            else:
                return HttpResponse("Successfully unliked the comment.", status=204)
        except  Like.DoesNotExist:
            return HttpResponse("Like object not found.", status=401) 


class LikedDetails(APIView):

    def get(self, request, author_id):

        full_url = request.build_absolute_uri()
        url = full_url.split('/liked')[0]
        hostname = urlparse(full_url).hostname

        #1a. Check if like object exists on local server
        all_liked = Like.objects.filter(author_id=author_id)

        # 2. Check if like object exists on remote server
        if not all_liked:
            # 3. Invalid request
            if hostname == "localhost" or hostname == "127.0.0.1":
                return Response("Like not found", status=404)
            else:
                response = requests.get(full_url)
                if response.status_code == 200:
                    return Response(response.json(), status=200)
                else:
                    return Response("Like not found", status=404)
        
        # 1b.
        serializer = LikeSerializer(all_liked, many=True, context={'request': request})
        items = []
        for each in serializer.data:
            update = collections.OrderedDict([('@context', v) if k == 'context' else (k, v) for k, v in each.items()])
            items.append(update)

        result = {}
        result['type'] = "liked"
        result['items'] = items

        return Response(result, status = 200)
