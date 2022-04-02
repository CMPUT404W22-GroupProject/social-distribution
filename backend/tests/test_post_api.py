from rest_framework.test import APITestCase
from author.models import Author
from post.models import Post
import uuid
import base64
from node.models import Node
from rest_framework.authtoken.models import Token
from rest_framework.test import force_authenticate



class PostListTest(APITestCase):
    """Test PostList class in views.py"""

    def setUp(self):
        #Creating a node object and setting authentication
        # self.node_dict = {
        #     "username" : "test",
        #     "password" : "test",
        #     "host":"local",
        #     "is_local":"True"
        # }
        # Node.objects.create(**self.node_dict)
        # self.client.credentials(HTTP_AUTHORIZATION= 'Basic ' + base64.b64encode(b"test:test").decode('utf-8'))

        self.user_data={
            "displayName":"user",
            "email":"user@user.ca",
            "github":"http:/www.google.com"
        }
        user = Author.objects.create(**self.user_data)
        Token.objects.create(user=user)
        self.token = Token.objects.get(user=user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)


        self.author_data = {
        "displayName" : "APITest",
        "email":"apitest@user.ca",
        "github" : "https://github.com/CMPUT404W22-GroupProject/social-distribution"
        }

        self.author = self.client.post("/authors/", self.author_data)
        self.author1 = Author.objects.get(id=self.author.data["id"])
        user = self.author1
        Token.objects.create(user=user)
        self.token = Token.objects.get(user=user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        author = self.author1
        self.author_data1 = {
            "type": "author",
            "id": author.id,
            "host": author.host,
            "displayName": author.displayName,
            "url": author.url,
            "github": author.github,
            "profileImage": author.profileImage
        }
    
        self.post_data = {
            "title": "Test title for Post",
            "description": "This is a description",
            "contentType": "text/plain",
            "content": "This is a test content",
            "author": self.author_data1,
            "categories": "Category1,Category2",
            "visibility": "FRIENDS",
            "unlisted": False
        }

    def testPostListGET(self):
        """Test GET request for posts"""
    
        # Populate list
        response = self.client.post("/authors/" +str(self.author1.uuid)+"/posts/", self.post_data,  format="json")
        # Check status is ok
        response = self.client.get("/authors/" +str(self.author1.uuid)+"/posts/")
        self.assertEqual(response.status_code, 200)

        # Check response has data
        self.assertTrue(len(response.data["items"]) > 0)

    def testPostListPOST(self):
        """Test POST request to create a new post"""
        response = self.client.post("/authors/" +str(self.author1.uuid) +"/posts/", self.post_data,  format="json")
        
        # check status is 201
        self.assertEqual(response.status_code, 201)

        # Check response has data
        self.assertTrue(len(response.data) > 0)

class PostDetailsTest(APITestCase):
    """Test PostDetails class in views.py"""

    def setUp(self):
        #Creating a node object and setting authentication
        # self.node_dict = {
        #     "username" : "test",
        #     "password" : "test",
        #     "host":"local",
        #     "is_local":"True"
        # }
        # Node.objects.create(**self.node_dict)
        # self.client.credentials(HTTP_AUTHORIZATION= 'Basic ' + base64.b64encode(b"test:test").decode('utf-8'))


        self.user_data={
            "displayName":"user",
            "email":"user@user.ca",
            "github":"http:/www.google.com"
        }
        user = Author.objects.create(**self.user_data)
        Token.objects.create(user=user)
        self.token = Token.objects.get(user=user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)


        self.author_data = {
        "displayName" : "APITest",
        "email":"apitest@user.ca",
        "github" : "https://github.com/CMPUT404W22-GroupProject/social-distribution"
        }

        self.author = self.client.post("/authors/", self.author_data)
        author = Author.objects.get(id=self.author.data["id"])
        self.author1 = author
        user = self.author1
        Token.objects.create(user=user)
        self.token = Token.objects.get(user=user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        self.author_data1 = {
            "type": "author",
            "id": author.id,
            "host": author.host,
            "displayName": author.displayName,
            "url": author.url,
            "github": author.github,
            "profileImage": author.profileImage
        }
    
        self.post_data = {
            "title": "Test title for Post",
            "description": "This is a description",
            "contentType": "text/plain",
            "content": "This is a test content",
            "author": self.author_data1,
            "categories": "Category1,Category2",
            "visibility": "FRIENDS",
            "unlisted": False
        }

        self.put_data = {
            "title": "Test title for Post",
            "description": "This is a description",
            "contentType": "text/plain",
            "content": "This is a test content",
            "author": self.author1.uuid,
            "categories": "Category1,Category2",
            "visibility": "FRIENDS",
            "unlisted": False
        }

        self.post_data_edit = {
            "title": "Test title for editing Post",
            "description": "This is a edit description",
            "contentType": "text/plain",
            "content": "This is a test content",
            "author": self.author_data1,
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
            author=self.author1,
            categories="Category3,Category4",
            visibility="FRIENDS",
            unlisted=True,
        )
        response = self.client.get("/authors/" + str(self.author1.uuid) +"/posts/"+str(new_post.uuid)+'/')
        # check if the status code is 201
        self.assertEqual(response.status_code, 200)

        # Check response has data
        self.assertTrue(len(response.data) > 0)

    def testPostDetailsPUT(self):
        """Test PUT request to create a new post"""
        # create a new uuid
        new_post_id = str(uuid.uuid4())

        response = self.client.post("/authors/" + str(self.author1.uuid) +"/posts/"+new_post_id+'/', self.put_data, format="json")
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
            author=self.author1,
            categories="Category3,Category4",
            visibility="FRIENDS",
            unlisted=True,
        )

        response = self.client.put("/authors/" + str(self.author1.uuid) +"/posts/"+str(new_post.uuid)+'/', self.post_data_edit, format="json")

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
            author=self.author1,
            categories="Category3,Category4",
            visibility="FRIENDS",
            unlisted=True,
        )
        response = self.client.delete("/authors/" + str(self.author1.uuid) +"/posts/"+str(new_post.uuid)+'/')

        # check if the status code is 204
        self.assertEqual(response.status_code, 204)
