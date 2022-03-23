from re import search
#from typing import final
from django.shortcuts import render
from django.http import HttpResponse
from follower.models import FollowRequest
from like.models import Like
from inbox.models import Inbox
from comment.models import Comment
from post.models import Post
from author.models import Author
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .pagination import InboxPageNumberPagination
from author.serializers import AuthorsSerializer
from inbox.serializers import InboxSerializer
from post.serializers import PostSerializerGet
import uuid


class InboxList(ListCreateAPIView):
    serializer_class = InboxSerializer
    pagination_class = InboxPageNumberPagination
    author_id = None

    def get_queryset(self):
        return Inbox.objects.filter(author_id=self.author_id).order_by('-created_date')

    # Get inbox
    def list(self, request, author_id):
        try:
            Author.objects.get(pk=author_id)
        except Author.DoesNotExist:
            return HttpResponse("Author does not exist", status=404)

        self.author_id = author_id
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        author5 = Author.objects.get(pk=author_id)
        author = AuthorsSerializer(author5, context={'request': request})
        items = []
        if page is not None:
            serializer = InboxSerializer(queryset, many=True, context={
                                         'listRequest': request})
            print(serializer)
            for each_object in serializer.data:
                each_object['author'] = author.data['id']
                items.append(each_object["items"])

            paginated_items = self.paginate_queryset(items)
            print("paginated", paginated_items)
            result = {}
            result['type'] = "inbox"
            result['author'] = str(
                request.build_absolute_uri().split('/inbox')[0])
            result['items'] = paginated_items

            return self.get_paginated_response(result)

        serializer = InboxSerializer(queryset, many=True, context={
                                     'listRequest': request})
        return Response(serializer.data, status=200)

    def post(self, request, author_id):
        request_data = request.data.copy()
        print(request_data)
        # An inbox object is created whenever a post, like, comment, follow is sent.
        # This object refers to the original item sent through their id.
        try:
            # If the request type is a post
            if request_data["type"].lower() == "post":
                post_id = request_data["id"]
                new_post = Post.objects.get(id=post_id)
                print(new_post, "new")
                Inbox.create_object_from_post(new_post, author_id)

            # If the request type is a comment
            elif request_data["type"].lower() == "comment":
                comment_id = request_data["id"]
                new_comment = Comment.objects.get(id=comment_id)
                Inbox.create_object_from_comment(new_comment, author_id)

            # If the request type is a like
            elif request_data["type"].lower() == "like":
                like_id = request_data["id"]
                new_like = Like.objects.get(id=like_id)
                Inbox.create_object_from_like(new_like)

            # If the request type is a follow
            # else:

            return Response("Sent to inbox", status=201)
        except:
            return Response("Error", status=400)

    # Clear inbox
    def delete(self, request, author_id):
        # INCLUDE PERMISSION CHECKS BEFORE DOING THIS
        author11 = Author.objects.get(pk=author_id)
        try:
            Inbox.objects.filter(author=author11).all().delete()
            return Response("Successfully cleared inbox.", status=201)
        except Inbox.DoesNotExist:
            return Response("No inbox found.", status=401)


'''
{
    "type": "comment",
"id":"ce968aa5-0a10-4f98-8206-3df0e5c24a58"
}
'''
