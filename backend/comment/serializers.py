# from post.serializers import PostSerializer
from comment.models import Comment
from rest_framework.serializers import ModelSerializer
from author.serializers import AuthorsSerializer
from rest_framework.serializers import SerializerMethodField
from post import serializers
import uuid
from author.models import Author
from inbox.models import Inbox
import requests
from node.authentication import BasicAuthentication

class CommentSerializer(ModelSerializer):

    class Meta:
        model = Comment
        fields = ('type', 'author', 'comment', 'contentType', 'published', 'id')

    def get_id(self, comment):
        try:
            request = self.context.get('request')
            return request.build_absolute_uri() + str(comment.uuid)
        except:
            "none"

    def create(self, validated_data):
        validated_data['post'] = self.context.get('post')
        new_comment = Comment.objects.create(**validated_data)

        request = self.context.get('request')

        full_url = request.build_absolute_uri()

        url_post = full_url.replace("/service", "").split('/comments/')[0]
        new_comment.id = url_post + '/comments/' + str(new_comment.uuid)

        new_comment.save()

        # Inbox.create_object_from_comment(new_comment, validated_data['post'].author.uuid)
        return new_comment

class CommentSerializerGet(CommentSerializer):
    author = SerializerMethodField()
    basic_auth = BasicAuthentication()

    def get_author(self, comment):
        request = self.context.get('request')
        try:
            author = Author.objects.get(id=comment.author)
            serializer = AuthorsSerializer(author, context={'request':request})
            return serializer.data
        except:
            response = self.basic_auth.get_request(comment.author)
            if response == None:
                return "Author Not Found"
            elif response.status_code != 200:
                return comment.author
            else:
                return response.json()
            