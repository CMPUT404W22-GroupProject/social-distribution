from django.shortcuts import render
from django.http import HttpResponse, Http404, request
from inbox.models import Inbox
from post.models import Post
from author.models import Author
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination, PageNumberPagination
from .pagination import InboxPageNumberPagination
import os
# Create your views here.
from inbox.serializers import InboxSerializer

class InboxList(ListCreateAPIView):

    serializer_class = InboxSerializer
    pagination_class = InboxPageNumberPagination
    author_id = None

    def get_queryset(self):
        return Inbox.objects.filter(author_id=self.author_id)
    
    # get recent posts of author
    def list(self, request, author_id):
        try:
            Author.objects.get(pk=author_id)
        except Author.DoesNotExist:
            return HttpResponse("Author does not exist", status=404)
        self.author_id = author_id
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer =  InboxSerializer(page, many=True, context={'listRequest':request})
            return self.get_paginated_response(serializer.data)

        serializer =  InboxSerializer(queryset, many=True, context={'listRequest':request})

        return Response(serializer.data, status=200)