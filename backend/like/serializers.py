from rest_framework.serializers import ModelSerializer
from like.models import Like

class LikeSerializer(ModelSerializer):
    class Meta:
        model = Like
        fields = "__all__"

    def create(self, validated_data):
        new_like = Like.objects.create(**validated_data)
        return new_like