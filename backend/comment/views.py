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
import uuid


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
            return Response("Comment not found", status=404)


    def create(self, request, author_id, post_id):
        try:
            post = Post.objects.filter(author_id=author_id).get(pk=post_id)
        except Post.DoesNotExist:
            return Response("Post not found.", status=401)
        
        try:
            request_data = request.data.copy()
            sender_id = request_data['author']['id']
            sender_uuid = uuid.UUID(sender_id.split('/authors/')[1].split('/')[0])
            request_data['author'] = sender_uuid

            serializer = CommentSerializer(data=request_data, context={'request':request, 'post':post})

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=201)
            else:
                return Response(serializer.errors, status=400)
        except Exception as e:
            return Response("Request data not in the right format", status=400)


class CommentDetails(APIView):
    # get comment
    def get(self, request, author_id, post_id, comment_id):
        try:
            comment = Comment.objects.filter(post=post_id).get(pk=comment_id)
            serializer = CommentSerializerGet(comment, context={'request':request})
            return Response(serializer.data, status=200)
        except Comment.DoesNotExist:
            return Response("Comment not found", status=404)