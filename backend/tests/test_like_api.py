from distutils.cmd import Command
from comment.models import Comment
from rest_framework.test import APITestCase
from author.models import Author
from like.models import Like
from PIL import Image
import tempfile
from post.models import Post
from rest_framework.authtoken.models import Token
from inbox.models import Inbox


class LikeListTest(APITestCase):
    """Test the LikeList class in views.py"""

    def setUp(self):

        #"user" is for authentication purposes
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

        self.post1 = self.client.post("/authors/" +str(self.author1.uuid)+"/posts/", self.post_data,  format="json")
        self.post = Post.objects.get(id=self.post1.data["id"])

        # Populate list
        Like.objects.create(
            type = "like",
            author=self.author1.id, 
            object=self.post.id,
            summary="likes",
            context="https://www.test.com"
        )
     
        
    def testViewLike(self):
        """Test GET request for all like"""

        
        # Check status is ok
        response = self.client.get("/authors/" + str(self.author1.uuid) + "/posts/" + str(self.post.uuid)+"/likes")
        self.assertEqual(response.status_code, 200)
        
        # Check response has data
        self.assertTrue(len(response.data) > 0)


    # def testLikeCreation(self):
    #     """Test POST request to create like for post objects"""
        
    #     # Ensure proper status code
    #     response = self.client.post("/authors/" + str(self.author.uuid) + "/posts/" + str(self.post.uuid) + "/likes", self.like_data_post, format="json")
    #     self.assertEqual(response.status_code, 201)
        
    #     # Ensure it was actually posted
    #     response = self.client.get("/authors/" + str(self.author.uuid) + "/posts/" + str(self.post.uuid) + "/likes")
    #     self.assertTrue(any(d["summary"] == "APITest likes your post" for d in response.data))
   
    def tearDown(self):
        authors = Author.objects.all()
        authors.delete()
        posts = Post.objects.all()
        posts.delete()
        like = Like.objects.all()
        like.delete()
        token = Token.objects.all()
        token.delete()


class LikeDetailsTest(APITestCase):
    """Test the LikedDetails class in views.py"""

    def setUp(self):
        
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

        self.post1 = self.client.post("/authors/" +str(self.author1.uuid)+"/posts/", self.post_data,  format="json")
        self.post = Post.objects.get(id=self.post1.data["id"])

        # Populate list

        self.like_data = {}
        self.like_data["context"] =  "https://www.test.com"
        self.like_data["summary"] = "APItest likes your post"

        self.like = Like.objects.create(
            id=self.post.id+"/likes/1",
            type = "like",
            author=self.author1.id, 
            object=self.post.id,
            summary=self.like_data["summary"],
            context= self.like_data["context"]
        )

    def testLikeDetails(self):
        """Test GET request for like's details"""
        # Check status code
        response = self.client.get(str(self.like.id))

        # check if the status code is 200
        self.assertEqual(response.status_code, 200)
        # Check response has data
        self.assertTrue(len(response.data) > 0)
        
        # Check details
        self.assertEqual(response.data["@context"], self.like_data["context"])
        self.assertEqual(response.data["summary"], self.like_data["summary"])
        self.assertEqual(response.data["type"], "like")
        self.assertEqual(response.data["author"]["displayName"], self.author_data["displayName"])
        self.assertEqual(response.data["object"].split('/posts/')[1], str(self.post.uuid))


    def testLikeDetailsDelete(self):
        """Test DELETE request to delete a like"""

        # Ensure object is present before deletion
        response = self.client.get(str(self.like.id))
        self.assertEqual(response.status_code, 200)

        # Remove object
        response = self.client.delete(str(self.like.id))
        self.assertEqual(response.status_code, 204)

        # Ensure object was removed
        response = self.client.get("/authors/" + str(self.author1.uuid) +"/posts/"+str(self.post.uuid)+"/likes")
        self.assertEqual(len(response.data), 0)
    

    def tearDown(self):
        authors = Author.objects.all()
        authors.delete()
        posts = Post.objects.all()
        posts.delete()
        like = Like.objects.all()
        like.delete()
