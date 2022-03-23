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

            elif inbox.post_object:
                url = inbox.post_object.id

            elif inbox.comment_object:
                url = inbox.comment_object.id

            response = requests.get(url).json()
            return response
        except:
            return {}