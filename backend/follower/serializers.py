from jinja2 import FileSystemLoader
from follower.models import FollowRequest
from follower.models import Follower
from rest_framework.serializers import ModelSerializer, SerializerMethodField
from author.serializers import AuthorsSerializer
from author.models import Author
import requests
from node.authentication import BasicAuthentication

class FollowerSerializer(ModelSerializer):

    class Meta:
        model = Follower
        fields = ("type", "author", "object")

class FollowerSerializerGet(FollowerSerializer):
    object = SerializerMethodField()
    author = AuthorsSerializer(many=False, read_only=True)
    basic_auth = BasicAuthentication()

    def get_object(self, follower):
        request = self.context.get('request')
        try:
            author = Author.objects.get(id=follower.object)
            serializer = AuthorsSerializer(author, context={'request':request})
            return serializer.data
        except:
            response = self.basic_auth.get_request(follower.object)
            if response == None:
                follower_object =Follower.objects.get(pk=follower.id)
                follower_object.delete()
                return 
            elif response.status_code != 200:
                return follower.object
            else:
                return response.json()


class FollowRequestSerializer(ModelSerializer):

    class Meta:
        model = FollowRequest
        fields = ("type", "id", "summary", "actor", "object")

class FollowRequestSerializerGet(FollowRequestSerializer):
    actor = SerializerMethodField()
    object = SerializerMethodField()
    basic_auth = BasicAuthentication()

    def get_actor(self, follow_request):
        request = self.context.get('request')
        try:
            actor = Author.objects.get(id=follow_request.actor)
            serializer = AuthorsSerializer(actor, context={'request':request})
            return serializer.data
        except:
            response_get = self.basic_auth.get_request(follow_request.actor)
            if response_get == None:
                return "Author not found"
            elif response_get.status_code != 200:
                return follow_request.actor
            else:
                return response_get.json()

    def get_object(self, follow_request):
        request = self.context.get('request')
        try:
            object = Author.objects.get(id=follow_request.object)
            serializer = AuthorsSerializer(object, context={'request':request})
            return serializer.data
        except:
            return {}