from rest_framework.test import APITestCase
from author.models import Author
from like.models import Like
from PIL import Image
import tempfile
from post.models import Post




class LikeListTest(APITestCase):
    """Test the LikeList class in views.py"""

    def setUp(self):
        self.author = Author.objects.create(
            email="test@example.com",
            displayName="APITest", 
            github="https://github.com/CMPUT404W22-GroupProject/social-distribution"
        )
        self.post = Post.objects.create(
            title="Test title for editing Post",
            description="This is a edit description",
            contentType="text/plain",
            content="This is a test content",
            author=self.author,
            categories="Category3,Category4",
            visibility="FRIENDS",
            unlisted=True,
        )

        self.like_data_post = {
        "context":"https://www.w3.org/ns/activitystreams",
        "summary": "APITest likes your post", 
        "type": "Like",
        "author": self.author.uuid,
        "object":self.post.uuid,
        "object1":""
        } 
        
    def testViewLike(self):
        """Test GET request for all like"""
        
        # Populate list
        new_like = Like.objects.create(
            context = "https://www.w3.org/ns/activitystreams",
            summary = "APITest likes your post", 
            type = "Like",
            author = self.author,
            object = self.post
        )
     
        # Check status is ok
        response = self.client.get("/authors/" + str(self.author.uuid) + "/posts/" + str(self.post.uuid) + "/likes")
        self.assertEqual(response.status_code, 200)
        
        # Check response has data
        self.assertTrue(len(response.data) > 0)


    def testLikeCreation(self):
        """Test POST request to create like for post objects"""
        
        # Ensure proper status code
        response = self.client.post("/authors/" + str(self.author.uuid) + "/posts/" + str(self.post.uuid) + "/likes", self.like_data_post)
        self.assertEqual(response.status_code, 201)
        
        # Ensure it was actually posted
        response = self.client.get("/authors/" + str(self.author.uuid) + "/posts/" + str(self.post.uuid) + "/likes")
        self.assertTrue(any(d["summary"] == "APITest likes your post" for d in response.data))
    
    def tearDown(self):
        authors = Author.objects.all()
        authors.delete()
        posts = Post.objects.all()
        posts.delete()
        like = Like.objects.all()
        like.delete()
