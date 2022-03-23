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


    #Inbox object stores the id of the original item
    def get_items(self, inbox):
        #Get original item through their id
        try:
            request = self.context.get('listRequest')
            url = request.build_absolute_uri()
            while url[-1]!="x":
                url = url[:len(url)-1]
            url = url[:len(url)-6] # remove /inbox from link
            if inbox.like_object:
                url = url + "/posts/" +str(inbox.like_object.object.uuid) + "/likes/" + str(inbox.like_object.id)
            elif inbox.post_object:
                url = url + "/posts/" +str(inbox.post_object.uuid)
            elif inbox.comment_object:
                url = url + "/posts/" +str(inbox.comment_object.post.uuid) + "/comments/" + str(inbox.comment_object.uuid)
            response = requests.get(url).json()
            return response
        except:
            return {}