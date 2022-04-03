from django.test import TestCase
from author.models import Author
from comment.models import Comment
from post.models import Post

    
class PostModelTest(TestCase):
    """Test the Post Model"""

    def setUp(self):
        
        self.author = Author.objects.create(
            email="test@example.com",
            displayName="APITest", 
            github="https://github.com/CMPUT404W22-GroupProject/social-distribution"
        )


        self.post_data = {
            "title": "Test title for Post",
            "description": "This is a description",
            "contentType": "text/plain",
            "content": "This is a test content",
            "author": self.author,
            "categories": "Category1,Category2",
            "visibility": "FRIENDS",
            "unlisted": False,
        }

        self.post = Post.objects.create(**self.post_data)

        self.comment_data = {
            "type":"comment",
            "comment": "This is a comment",
            "contentType": "text/plain",
            "author": self.author,
            "post": self.post
        }

        self.comment = Comment.objects.create(**self.comment_data)

    def testPostModel(self):
        """Test all Post fields"""
        self.assertEqual(self.comment.type, self.comment_data["type"])
        self.assertEqual(self.comment.comment, self.comment_data["comment"])
        self.assertEqual(self.comment.contentType, self.comment_data["contentType"])
        self.assertEqual(self.comment.author, self.comment_data["author"])
        self.assertEqual(self.comment.post, self.comment_data["post"])


    def tearDown(self):
        self.comment.delete()