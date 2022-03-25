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
from urllib.parse import urlparse

class InboxSerializer(ModelSerializer):
    author = AuthorsSerializer(many=False, read_only=True)
    items = SerializerMethodField()
   
    class Meta:
        model = Inbox
        fields = ('type', 'author', 'items')

    def make_request(self, url):
        try:
            response = requests.get(url).json()
        except:
            try:
                scheme, netloc, path, params, query, fragment = urlparse(url)
                url_service = '{}://{}/{}{}'.format(scheme, netloc, "service", path)
                response = requests.get(url_service).json()
            except:
                response = {}
        
        return response

    #Inbox object stores the id of the original item
    def get_items(self, inbox):
        #Get original item through their id
        try:
            if inbox.like_object:
                response = self.make_request(inbox.like_object.id)

            elif inbox.post_object:
                response = self.make_request(inbox.post_object.id)

            elif inbox.comment_object:
                response = self.make_request(inbox.comment_object.id)

            elif inbox.follow_request_object:
                follow_request = inbox.follow_request_object
                response = {}
                response['type'] = "follow"
                response['summary'] = follow_request.summary
                response['actor'] = self.make_request(follow_request.actor)
                response['object'] = self.make_request(follow_request.object)

            return response
        except Exception as e:
            return {}