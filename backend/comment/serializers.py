# from post.serializers import PostSerializer
from comment.models import Comment
from rest_framework.serializers import ModelSerializer
from author.serializers import AuthorsSerializer
from post import serializers
import uuid
from author.models import Author
from inbox.models import Inbox

class CommentSerializer(ModelSerializer):

    class Meta:
        model = Comment
        fields = ('type', 'author', 'comment', 'contentType', 'published', 'id')

    def create(self, validated_data):
        validated_data['post'] = self.context.get('post')
        new_comment = Comment.objects.create(**validated_data)

        request = self.context.get('request')
        url_no_id = request.build_absolute_uri().split('/comments/')[0]
        new_comment.id = url_no_id + '/comments/' + str(new_comment.uuid)

        new_comment.save()

        Inbox.create_object_from_comment(new_comment, validated_data['post'].author.uuid)
        return new_comment

class CommentSerializerGet(CommentSerializer):
    author = AuthorsSerializer(many=False, read_only=True)