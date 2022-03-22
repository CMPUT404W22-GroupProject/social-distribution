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

class InboxItemSerializer(BaseSerializer):
    class Meta:
        model = Inbox

    def to_representation(self, obj):
        # if obj.like_object:
        #     return "none"
        if obj.post_object:
            return PostSerializerGet(obj.post_object, context={'request': self.context.get('request')}).data
        elif obj.comment_object:
            return CommentSerializerGet(obj.comment_object, context={'request': self.context.get('request')}).data
        elif obj.follow_request_object:
            return FollowRequestSerializer(obj.follow_request_object, context={'request': self.context.get('request')}).data

# Basic Post Serializer
class InboxSerializer(ModelSerializer):
    author = AuthorsSerializer(many=False, read_only=True)
    items = InboxItemSerializer(many=True, read_only=True)

    class Meta:
        model = Inbox
        fields = ('type', 'author', 'items')

#     #Inbox object stores the id of the original item
#     # def get_items(self, inbox):
    #     #Get original item through their id
    #     request = self.context.get('listRequest')
    #     # url = request.build_absolute_uri()
    #     # url = url[:len(url)-6] # remove /inbox from link
    #     # if inbox.like_object:
    #     #     url = url + "/posts/" +str(inbox.like_object.object.uuid) + "/likes/" + str(inbox.like_object.id)
    #     # elif inbox.post_object:
    #     #     url = url + "/posts/" +str(inbox.post_object.uuid)
    #     # elif inbox.comment_object:
    #     #     url = url + "/posts/" +str(inbox.comment_object.post.uuid) + "/comments/" + str(inbox.comment_object.uuid)
    #     # response = requests.get(url).json()
    #     try:
    #         request = self.context.get('listRequest')
    #         url = request.build_absolute_uri()
    #         url = url[:len(url)-6] # remove /inbox from link
    #         if inbox.like_object:
    #             like = Like.objects.get(pk=inbox.like_object.id)
    #             serializer = LikeSerializer(like, many=False, context={'request': request})
    #             print("like",inbox.like_object)
    #             # response = 
    #             # response = LikedD
    #             # url = url + "/posts/" +str(inbox.like_object.object.uuid) + "/likes/" + str(inbox.like_object.id)
    #             response = {}
    #         elif inbox.post_object:
    #             post = Post.objects.get(pk=inbox.post_object.uuid)
    #             serializer = PostSerializer(post, many=False, context={'request': request})
    #             # url = url + "/posts/" +str(inbox.post_object.uuid)
    #         elif inbox.comment_object:
    #             comment = Comment.objects.get(pk=inbox.comment_object.uuid)
    #             serializer = CommentSerializer(comment, many=False, context={'request': request})
    #             print("comment",inbox.comment_object)
    #             # url = url + "/posts/" +str(inbox.comment_object.post.uuid) + "/comments/" + str(inbox.comment_object.uuid)
    #         # response = requests.get(url).json()
    #         return serializer.data
    #     except Exception as e:
    #         return {}