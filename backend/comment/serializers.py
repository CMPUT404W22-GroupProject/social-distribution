# from post.serializers import PostSerializer
from comment.models import Comment
from rest_framework.serializers import ModelSerializer, SerializerMethodField
from author.serializers import AuthorsSerializer

class CommentSerializer(ModelSerializer):
    author = AuthorsSerializer(many=False, read_only=True)
    # post = PostSerializer(many=False, read_only=True)
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
        new_comment = Comment.objects.create(**validated_data)
        return new_comment
