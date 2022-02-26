from django.http import HttpResponse, Http404
from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from post.models import Post
from comment.models import Comment
from comment.serializers import CommentSerializer
from .pagination import CommentPageNumberPagination

# Create your views here.

class CommentList(ListCreateAPIView):

    queryset =  Comment.objects.all()
    serializer_class = CommentSerializer
    pagination_class = CommentPageNumberPagination
    # paginate_by = 2
    # permission_classes = [IsAdminUser]

    # get recent posts of author
    def list(self, request, author_id, post_id):
        #TODO handle recent, pagenation
        # try:
        #     Author.objects.get(pk=author_id)
        # except Author.DoesNotExist:
        #     return HttpResponse("Author not found.", status=404)
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer =  CommentSerializer(page, many=True, context={'request':request})
            return self.get_paginated_response(serializer.data)

        serializer =  CommentSerializer(queryset, many=True, context={'request':request})
        return Response(serializer.data, status=200)
        # serializer = PostSerializer(queryset, many=True)
        # return Response(serializer.data, status=200)

    # def get(self, request, author_id, post_id):
    #     try:
    #         Post.objects.get(pk=post_id)
    #     except Post.DoesNotExist:
    #         return Http404
        
    #     comments = Comment.objects.all()
    #     serializer = CommentSerializer(comments, many=True)
    #     return Response(serializer.data, status=200)

    def create(self, request, author_id, post_id):
        try:
            Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return Http404
        
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=400)