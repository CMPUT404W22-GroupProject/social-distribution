from follower.models import FollowRequest
from follower.models import Follower
from rest_framework.serializers import ModelSerializer
from author.serializers import AuthorsSerializer

class FollowerSerializer(ModelSerializer):
    items = AuthorsSerializer(many=True)

    class Meta:
        model = Follower
        fields = ("type", "items")
    
class FollowRequestSerializer(ModelSerializer):
    actor = AuthorsSerializer(many=False, read_only=True)
    object = AuthorsSerializer(many=False, read_only=True)

    class Meta:
        model = FollowRequest
        fields = ("type", "summary", "actor", "object")