# from post.serializers import PostSerializer
from comment.models import Comment
from rest_framework.serializers import ModelSerializer, SerializerMethodField
from author.serializers import AuthorsSerializer
# from post.serializers import PostSerializer
from post import serializers
import uuid
from author.models import Author

class CommentSerializer(ModelSerializer):
    id = SerializerMethodField()

    class Meta:
        model = Comment
        fields = ('type', 'author', 'comment', 'contentType', 'published', 'id')

    def get_id(self, comment):
        request = self.context.get('request')
        url_no_id = request.build_absolute_uri().split('/comments/')[0]
        return url_no_id + '/comments/' + str(comment.uuid)

    def create(self, validated_data):
        validated_data['post'] = self.context.get('post')
        new_comment = Comment.objects.create(**validated_data)
        return new_comment

class CommentSerializerGet(CommentSerializer):
    author = AuthorsSerializer(many=False, read_only=True)