from rest_framework.serializers import ModelSerializer, CharField
from author.serializers import AuthorsSerializer
from inbox.models import Inbox
from like.models import Like
import json

class LikeSerializer(ModelSerializer):
    author = AuthorsSerializer(many=False, read_only=True)

    class Meta:
        model = Like
        fields = ('id', 'context', 'summary', 'type', 'author', 'object')

    def create(self, validated_data):
        new_like = Like.objects.create(**validated_data)
        request = self.context.get('request')
        full_url = request.build_absolute_uri()

        url_like = full_url.replace("/service", "").split('/likes')[0]
        new_like.id = url_like + '/likes/' + str(new_like._id)

        new_like.save()
        # Inbox.create_object_from_like(new_like)
        return new_like