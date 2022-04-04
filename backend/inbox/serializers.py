# from backend.inbox.models import InboxItem
from follower.serializers import FollowRequestSerializer
from inbox.models import Inbox
from post.models import Post
from author.models import Author
# from comment.models import Comment
from like.models import Like
from rest_framework.serializers import ModelSerializer, SerializerMethodField, BaseSerializer
from author.serializers import AuthorsSerializer
import requests
from django.urls import path
from post.serializers import PostSerializerGet
from comment.serializers import CommentSerializerGet
from like.serializers import LikeSerializerGet
from post.serializers import PostSerializerGet
from follower.serializers import FollowRequestSerializerGet
from urllib.parse import urlparse
from requests.auth import HTTPBasicAuth
from node.authentication import BasicAuthentication

class InboxSerializer(ModelSerializer):
    author = AuthorsSerializer(many=False, read_only=True)
    items = SerializerMethodField()
    basic_auth = BasicAuthentication()
   
    class Meta:
        model = Inbox
        fields = ('type', 'author', 'items')

    #Inbox object stores the id of the original item
    def get_items(self, inbox):
        #Get original item through their id
        request = self.context.get('request')
        author = self.context.get('author')
        try:
            if inbox.like_object:
                req = Inbox.objects.get(author=author, like_object__id=inbox.like_object.id)
                response = LikeSerializerGet(req.like_object, context={'request':request}).data

            elif inbox.post_object:
                req = Inbox.objects.get(author=author, post_object__id=inbox.post_object.id)
                response = PostSerializerGet(req.post_object, context={'request':request}).data

            elif inbox.comment_object:
                req = Inbox.objects.get(author=author, comment_object__id=inbox.comment_object.id)
                response = CommentSerializerGet(req.comment_object, context={'request':request}).data

            elif inbox.follow_request_object:
                response = FollowRequestSerializerGet(inbox.follow_request_object, context={'request':request}).data
                # response = {}
                # response['type'] = "follow"
                # response['summary'] = follow_request.summary

                # print("follow_request", follow_request)
                # print("follow_request.actor", follow_request.actor)
                # print("follow_request.object", follow_request.object)

                # # get actor (local/remote)
                # try:
                #     actor = Author.objects.get(id=follow_request.actor)
                #     serializer_actor = AuthorsSerializer(actor, context={'request':request})
                #     actor_data = serializer_actor.data
                # except:
                #     response_get = self.basic_auth.get_request(follow_request.actor)
                #     if response_get == None:
                #         actor_data = "Author not found"
                #     elif response_get.status_code != 200:
                #         actor_data = follow_request.actor
                #     else:
                #         actor_data = response_get.json()
                # response['actor'] = actor_data

                # try:
                #     object = Author.objects.get(id=follow_request.object)
                #     serializer_object = AuthorsSerializer(object, context={'request':request})
                # except:
                #     return {}
                # response['object'] = serializer_object.data

            return response
        except Exception as e:
            print("error", e)
            return {}