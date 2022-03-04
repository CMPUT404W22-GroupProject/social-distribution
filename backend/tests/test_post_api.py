from rest_framework.test import APITestCase
from author.models import Author
from post.models import Post
import uuid

class PostListTest(APITestCase):
    """Test PostList class in views.py"""

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
    
    def testPostListGET(self):
        """Test GET request for posts"""

        # Populate list
        self.client.post("/authors/" + str(self.author.uuid) +"/posts/", self.post_data)

        # Check status is ok
        response = self.client.get("/authors/" + str(self.author.uuid) +"/posts/")

        self.assertEqual(response.status_code, 200)

        # Check response has data
        self.assertTrue(len(response.data) > 0)
    
    def testPostListPOST(self):
        """Test POST request to create a new post"""
        response = self.client.post("/authors/" + str(self.author.uuid) +"/posts/", self.post_data)

        # check status is 201
        self.assertEqual(response.status_code, 201)

        # Check response has data
        self.assertTrue(len(response.data) > 0)

class PostDetailsTest(APITestCase):
    """Test PostDetails class in views.py"""

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

        self.post_data_edit = {
            "title": "Test title for editing Post",
            "description": "This is a edit description",
            "contentType": "text/plain",
            "content": "This is a test content",
            "author": self.author.uuid,
            "categories": "Category3,Category4",
            "visibility": "FRIENDS",
            "unlisted": True,
        }

    def testPostDetailsGET(self):
        """Test GET request to get a post"""
        new_post = Post.objects.create(
            title="Test title for editing Post",
            description="This is a edit description",
            contentType="text/plain",
            content="This is a test content",
            author=self.author,
            categories="Category3,Category4",
            visibility="FRIENDS",
            unlisted=True,
        )
        response = self.client.get("/authors/" + str(self.author.uuid) +"/posts/"+str(new_post.uuid)+'/')

        # check if the status code is 201
        self.assertEqual(response.status_code, 200)

        # Check response has data
        self.assertTrue(len(response.data) > 0)

    def testPostDetailsPUT(self):
        """Test PUT request to create a new post"""
        # create a new uuid
        new_post_id = str(uuid.uuid4())

        response = self.client.put("/authors/" + str(self.author.uuid) +"/posts/"+new_post_id+'/', self.post_data)

        # check status is 201
        self.assertEqual(response.status_code, 201)

        # Check response has data
        self.assertTrue(len(response.data) > 0)
    
    def testPostDetailsPOST(self):
        """Test POST request to edit a post"""
        # create a post to be edited
        new_post = Post.objects.create(
            title="Test title for editing Post",
            description="This is a edit description",
            contentType="text/plain",
            content="This is a test content",
            author=self.author,
            categories="Category3,Category4",
            visibility="FRIENDS",
            unlisted=True,
        )
        response = self.client.post("/authors/" + str(self.author.uuid) +"/posts/"+str(new_post.uuid)+'/', self.post_data_edit)

        # check if the status code is 201
        self.assertEqual(response.status_code, 201)

        # Check response has data
        self.assertTrue(len(response.data) > 0)
    
    def testPostDetailsDELETE(self):
        """Test DELETE request to delete a post"""
        # create a post to be deleted
        new_post = Post.objects.create(
            title="Test title for editing Post",
            description="This is a edit description",
            contentType="text/plain",
            content="This is a test content",
            author=self.author,
            categories="Category3,Category4",
            visibility="FRIENDS",
            unlisted=True,
        )
        response = self.client.delete("/authors/" + str(self.author.uuid) +"/posts/"+str(new_post.uuid)+'/')

        # check if the status code is 204
        self.assertEqual(response.status_code, 204)
