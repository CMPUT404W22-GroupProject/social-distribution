# from post.serializers import PostSerializer
from comment.models import Comment
from rest_framework.serializers import ModelSerializer, SerializerMethodField
from author.serializers import AuthorsSerializer
# from post.serializers import PostSerializer
from post import serializers

class CommentSerializer(ModelSerializer):
    # author = AuthorsSerializer(many=False, read_only=True)
    id = SerializerMethodField()

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
        return new_comment