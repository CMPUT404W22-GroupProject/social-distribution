from rest_framework.serializers import ModelSerializer
from inbox.models import Inbox
from like.models import Like

class LikeSerializer(ModelSerializer):
    class Meta:
        model = Like
        fields = "__all__"

    def create(self, validated_data):
        new_like = Like.objects.create(**validated_data)
        Inbox.create_object_from_like(new_like)
        return new_like