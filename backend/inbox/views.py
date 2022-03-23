from re import search
import re
from django.shortcuts import render
from django.http import HttpResponse, Http404, request
from inbox.models import Inbox
from like.serializers import LikeSerializer
from post.models import Post
from author.models import Author
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination, PageNumberPagination
from .pagination import InboxPageNumberPagination
from author.serializers import AuthorsSerializer

import os
# Create your views here.
from inbox.serializers import InboxSerializer

class InboxList(ListCreateAPIView):

    serializer_class = InboxSerializer
    pagination_class = InboxPageNumberPagination
    author_id = None

    def get_queryset(self):
        return Inbox.objects.filter(author_id=self.author_id)
    
    #Get inbox 
    def list(self, request, author_id):
        try:
            Author.objects.get(pk=author_id)
        except Author.DoesNotExist:
            return HttpResponse("Author does not exist", status=404)
        self.author_id = author_id
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        author5 = Author.objects.get(pk=author_id)
        author = AuthorsSerializer(author5, context={'request':request})
        if page is not None:
            serializer =  InboxSerializer(page, many=True, context={'listRequest':request})
            for each_object in serializer.data:
                each_object['author'] = author.data['id']
            return self.get_paginated_response(serializer.data)
        serializer =  InboxSerializer(queryset, many=True, context={'listRequest':request})
        return Response(serializer.data, status=200)

      # Add a like object FOR POSTS
    def post(self, request, author_id):
        return HttpResponse("Sent to inbox", status=201) 

    #Clear inbox
    def delete(self, request, author_id):
        # INCLUDE PERMISSION CHECKS BEFORE DOING THIS
        author11 = Author.objects.get(pk=author_id)
        try:
            Inbox.objects.filter(author=author11).all().delete()
            return HttpResponse("Successfully cleared inbox.", status=201)
        except  Inbox.DoesNotExist:
            return HttpResponse("No inbox found.", status=401) 
