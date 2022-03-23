# from post.serializers import PostSerializer
from comment.models import Comment
from rest_framework.serializers import ModelSerializer, SerializerMethodField
from author.serializers import AuthorsSerializer
# from post.serializers import PostSerializer
from post import serializers
import uuid
from author.models import Author

class CommentSerializer(ModelSerializer):
    # author = AuthorsSerializer(many=False, read_only=True)
    id = SerializerMethodField()
    author = SerializerMethodField()

    class Meta:
        model = Comment
        fields = ('type', 'author', 'comment', 'contentType', 'published', 'id')

    def get_id(self, comment):
        try:
            request = self.context.get('request')
            return request.build_absolute_uri() + str(comment.uuid)
        except:
            "none"
    
    def get_author(self, comment):
        request = self.context.get('request')
        # request_uuid = uuid.UUID(str(request.user))
        request_uuid = str(request).split('/posts/')[0].split('authors/')[1]
        author = Author.objects.get(pk=request_uuid)
        serializer = AuthorsSerializer(author, context={'request':request})
        return serializer.data

    def create(self, validated_data):
        validated_data['post'] = self.context.get('post')
        new_comment = Comment.objects.create(**validated_data)
        return new_comment