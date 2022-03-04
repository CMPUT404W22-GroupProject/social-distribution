from django.test import TestCase
from author.models import Author
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
            "author": self.author.uuid,
            "categories": "Category1,Category2",
            "visibility": "FRIENDS",
            "unlisted": False,
        }

    def testPostModel(self):
        """Test all Post fields"""
        
        self.assertEqual(self.author.type, "post")
        self.assertEqual(self.author.url, self.url)
        self.assertEqual(self.author.host, self.test_dict["host"])
        self.assertEqual(self.author.displayName, self.test_dict["displayName"])
        self.assertEqual(self.author.github, self.test_dict["github"])

    def tearDown(self):
        self.post_data.delete()