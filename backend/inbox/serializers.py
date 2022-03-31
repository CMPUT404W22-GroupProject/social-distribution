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
from urllib.parse import urlparse
from requests.auth import HTTPBasicAuth

class InboxSerializer(ModelSerializer):
    author = AuthorsSerializer(many=False, read_only=True)
    items = SerializerMethodField()
   
    class Meta:
        model = Inbox
        fields = ('type', 'author', 'items')

    def make_request(self, url):
        response = requests.get(url, auth=HTTPBasicAuth('admin', 'gwbRqv8ZLtM3TFRW'))
        if response.status_code != 200:
            return url
        
        return response.json()

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
                follow_request = inbox.follow_request_object
                response = {}
                response['type'] = "follow"
                response['summary'] = follow_request.summary
                response['actor'] = self.make_request(follow_request.actor)
                response['object'] = self.make_request(follow_request.object)

            return response
        except Exception as e:
            print("error", e)
            return {}