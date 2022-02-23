from rest_framework.serializers import ModelSerializer
from like.models import Like

class LikeSerializer(ModelSerializer):
    class Meta:
        model = Like
        fields = ['context','summary','type', 'author'] #,'object']