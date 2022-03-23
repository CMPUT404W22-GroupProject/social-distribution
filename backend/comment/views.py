from django.http import HttpResponse, Http404
from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from post.models import Post
from comment.models import Comment
from author.models import Author
from comment.serializers import CommentSerializer, CommentSerializerGet
from .pagination import CommentPageNumberPagination
from urllib.parse import urlparse
import requests


class CommentList(ListCreateAPIView):
    serializer_class = CommentSerializer
    pagination_class = CommentPageNumberPagination
    post_id = None

    def get_queryset(self):
        return Comment.objects.filter(post=self.post_id).order_by('published')

    # get recent posts of author
    def list(self, request, author_id, post_id):
        try: 
            Post.objects.filter(author_id=author_id).get(pk=post_id)
            self.post_id = post_id
            queryset = self.filter_queryset(self.get_queryset())

            # there is no comment to a post
            if not queryset:
                return Response("No comments", status=404)

            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer =  CommentSerializerGet(page, many=True, context={'request':request})
                return self.get_paginated_response(serializer.data)

            serializer =  CommentSerializerGet(queryset, many=True, context={'request':request})
            return Response(serializer.data, status=200)
            
        except Post.DoesNotExist:
            full_url = request.build_absolute_uri()
            hostname = urlparse(full_url).hostname
            if hostname == "localhost" or hostname == "127.0.0.1":
                return Response("Comment not found", status=404)
            else:
                response = requests.get(full_url)
                if response.status_code == 200:
                    return Response(response.json(), status=200)
                else:
                    return Response("Comment not found", status=404)


    def create(self, request, author_id, post_id):
        try:
            post = Post.objects.filter(author_id=author_id).get(pk=post_id)
        except Post.DoesNotExist:
            return Response("Post not found.", status=401)
        serializer = CommentSerializer(data=request.data, context={'request':request, 'post':post})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=400)


class CommentDetails(APIView):
    # get comment
    def get(self, request, author_id, post_id, comment_id):
        try:
            comment = Comment.objects.filter(post=post_id).get(pk=comment_id)
            serializer = CommentSerializerGet(comment, context={'request':request})
            return Response(serializer.data, status=200)
        except Comment.DoesNotExist:
            full_url = request.build_absolute_uri()
            hostname = urlparse(full_url).hostname
            if hostname == "localhost" or hostname == "127.0.0.1":
                return Response("Comment not found", status=404)
            else:
                response = requests.get(full_url)
                if response.status_code == 200:
                    return Response(response.json(), status=200)
                else:
                    return Response("Comment not found", status=404)