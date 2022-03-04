from inbox.models import Inbox
from post.models import Post
from rest_framework.serializers import ModelSerializer, SerializerMethodField
from author.serializers import AuthorsSerializer
import requests
from django.urls import path

# Basic Post Serializer
class InboxSerializer(ModelSerializer):
    author = AuthorsSerializer(many=False, read_only=True)
    items = SerializerMethodField()
   

    class Meta:
        model = Inbox
        fields = ('type', 'author', 'items')

    def get_items(self, inbox):
        try:
            request = self.context.get('listRequest')
            url = request.build_absolute_uri()
            url = url[:len(url)-6] # remove /inbox from link
            
            if inbox.like_object:
                url = url + "/posts/" +str(inbox.like_object.object.uuid) +'/likes/' + str(inbox.like_object.id)
            else:
                print("Post object")
                # url = url + "/posts/" +str(inbox.post_object.object.uuid)
            response = requests.get(url).json()
            return response
        except:
            return {}