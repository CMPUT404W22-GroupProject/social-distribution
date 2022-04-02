from distutils.cmd import Command
from comment.models import Comment
from rest_framework.test import APITestCase
from author.models import Author
from like.models import Like
from inbox.models import Inbox

from PIL import Image
import tempfile
from post.models import Post
from rest_framework.authtoken.models import Token


class InboxListTest(APITestCase):
    """Test the InboxList class in views.py"""
    # Inbox is being tested using a LIKE object.
    # Same process for any other object type.
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
        
        #Inbox requires only "type" and "id" of the object
        self.inbox_data = {
        "type":"post",
        "id": self.post.id
        } 
        
    def testViewInbox(self):
        """Test GET request for inbox"""
        
        # Populate list
        #Creating inbox object from like object
        like_object = Inbox.create_object_from_post(self.post, self.author1.uuid)

        # Check status is ok
        response = self.client.get("/authors/" + str(self.author1.uuid) + "/inbox/")
        self.assertEqual(response.status_code, 200)
        
        # Check response has data
        self.assertTrue(response.data["count"] > 0)

    def testLikeCreation(self):
        """Test POST request to create an inbox object"""
        
        # Ensure proper status code
        response = self.client.post("/authors/" + str(self.author1.uuid) + "/inbox/", self.inbox_data)
        self.assertEqual(response.status_code, 201)
        
        # Ensure it was actually posted
        response = self.client.get("/authors/" + str(self.author1.uuid) + "/inbox/")
        self.assertEqual(len(response.data["items"]), 1)
   

    def testInboxClear(self):
        """Test DELETE request to clear inbox"""

        # Ensure object is present before deletion
        response = self.client.get("/authors/" + str(self.author1.uuid) +"/inbox/")
        self.assertEqual(response.status_code, 200)

        # Remove object
        response = self.client.delete("/authors/" + str(self.author1.uuid) +"/inbox/")
        self.assertEqual(response.status_code, 201)

        # Ensure object was removed
        response = self.client.get("/authors/" + str(self.author1.uuid) +"/inbox/")
        self.assertEqual(len(response.data["items"]), 0)


    def tearDown(self):
        authors = Author.objects.all()
        authors.delete()
        posts = Post.objects.all()
        posts.delete()
        like = Like.objects.all()
        like.delete()
        inbox = Inbox.objects.all()
        inbox.delete()