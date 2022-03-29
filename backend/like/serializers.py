from rest_framework.serializers import ModelSerializer, SerializerMethodField
from author.serializers import AuthorsSerializer
from inbox.models import Inbox
from like.models import Like
from author.models import Author
import json
import requests
from requests.auth import HTTPBasicAuth
from node.authentication import BasicAuthentication

class LikeSerializer(ModelSerializer):

    class Meta:
        model = Like
        fields = ('id', 'context', 'summary', 'type', 'author', 'object')

    def create(self, validated_data):
        new_like = Like.objects.create(**validated_data)
        new_like.id = new_like.object + '/likes/' + str(new_like._id)

        new_like.save()
        return new_like

class LikeSerializerGet(LikeSerializer):
    author = SerializerMethodField()
    basic_auth = BasicAuthentication()

    def get_author(self, like):
        request = self.context.get('request')
        try:
            author = Author.objects.get(id=like.author)
            serializer = AuthorsSerializer(author, context={'request':request})
            return serializer.data
        except:
            response = self.basic_auth.get_request(like.author)

            if response.status_code == None:
                return "Author Not Found"
            elif response.status_code != 200:
                return like.author
            else:
                return response.json()