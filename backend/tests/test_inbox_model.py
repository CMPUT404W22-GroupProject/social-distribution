from django.test import TestCase
from author.models import Author
from like.models import Like
from post.models import Post
from inbox.models import Inbox


class InboxModelTest(TestCase):
    """Test the Inbox Model"""

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

        #Liking a post
        self.like_data_post = {
            "context":"https://www.w3.org/ns/activitystreams",
            "summary": "APITest likes your post", 
            "type":"Like",
            "author":self.author,
            "object":self.post
        }
        self.like_post  = Like.objects.create(**self.like_data_post)

        #Creating inbox object from like
        self.inbox = Inbox.create_object_from_like(self.like_post, self.author.uuid)

    def testLikeModel(self):
        """Test all INBOX fields"""
        self.assertEqual(self.inbox.type, "inbox")
        self.assertEqual(self.inbox.author, self.like_data_post["author"])
        self.assertEqual(self.inbox.like_object, self.like_post)

    def tearDown(self):
        self.author.delete()
        self.like_post.delete()
        self.inbox.delete()
