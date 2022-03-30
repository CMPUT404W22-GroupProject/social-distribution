from django.test import TestCase
from author.models import Author
from post.models import Post
from author.serializers import AuthorsSerializer
    
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

    def testPostModel(self):
        """Test all Post fields"""
        self.assertEqual(self.post.title, self.post_data["title"])
        self.assertEqual(self.post.description, self.post_data["description"])
        self.assertEqual(self.post.contentType, self.post_data["contentType"])
        self.assertEqual(self.post.content, self.post_data["content"])
        self.assertEqual(self.post.author, self.post_data["author"])
        self.assertEqual(self.post.categories, self.post_data["categories"])
        self.assertEqual(self.post.visibility, self.post_data["visibility"])
        self.assertEqual(self.post.unlisted, self.post_data["unlisted"])

    def tearDown(self):
        self.post.delete()