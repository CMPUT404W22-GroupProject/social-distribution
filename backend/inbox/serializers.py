# from backend.inbox.models import InboxItem
from follower.serializers import FollowRequestSerializer
from inbox.models import Inbox
from post.models import Post
# from comment.models import Comment
from like.models import Like
from rest_framework.serializers import ModelSerializer, SerializerMethodField, BaseSerializer
from author.serializers import AuthorsSerializer
import requests
from django.urls import path
from post.serializers import PostSerializerGet
from comment.serializers import CommentSerializerGet

class InboxSerializer(ModelSerializer):
    author = AuthorsSerializer(many=False, read_only=True)
    items = SerializerMethodField()
   
    class Meta:
        model = Inbox
        fields = ('type', 'author', 'items')

    #Inbox object stores the id of the original item
    def get_items(self, inbox):
        #Get original item through their id
        try:
            if inbox.like_object:
                url = inbox.like_object.id
                response = requests.get(url).json()

            elif inbox.post_object:
                url = inbox.post_object.id
                response = requests.get(url).json()

            elif inbox.comment_object:
                url = inbox.comment_object.id
                response = requests.get(url).json()

            elif inbox.follow_request_object:
                follow_request = inbox.follow_request_object
                response = {}
                response['type'] = "follow"
                response['summary'] = follow_request.summary
                response['actor'] = requests.get(follow_request.actor).json()
                response['object'] = requests.get(follow_request.object).json()

            return response
        except Exception as e:
            return {}