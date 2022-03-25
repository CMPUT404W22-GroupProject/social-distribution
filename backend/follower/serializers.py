from jinja2 import FileSystemLoader
from follower.models import FollowRequest
from follower.models import Follower
from rest_framework.serializers import ModelSerializer, SerializerMethodField
from author.serializers import AuthorsSerializer
from author.models import Author
import requests

class FollowerSerializer(ModelSerializer):

    class Meta:
        model = Follower
        fields = ("type", "author", "object")

class FollowerSerializerGet(FollowerSerializer):
    object = SerializerMethodField()
    author = AuthorsSerializer(many=False, read_only=True)

    def get_object(self, follower):
        response = requests.get(follower.object)
        if response.status_code == 404:
            follower_object =Follower.objects.get(pk=follower.id)
            follower_object.delete()
            return 
        elif response.status_code != 200:
            return follower.object
        else:
            return response.json()


class FollowRequestSerializer(ModelSerializer):
    # actor = AuthorsSerializer(many=False, read_only=True)
    # object = AuthorsSerializer(many=False, read_only=True)

    class Meta:
        model = FollowRequest
        fields = ("type", "summary", "actor", "object")