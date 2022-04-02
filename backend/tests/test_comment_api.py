from rest_framework.test import APITestCase
from author.models import Author
from post.models import Post
from comment.models import Comment
from node.models import Node
from rest_framework.authtoken.models import Token
import base64


class CommentListTest(APITestCase):
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

        self.post1 = self.client.post("/authors/" +str(self.author1.uuid)+"/posts/", self.post_data,  format="json")
        self.post = Post.objects.get(id=self.post1.data["id"])

        self.comment_data = {
            # "type" : "comment",
            "author": self.author_data1,
            "comment": "hello",
            "contentType":"text/plain"
            # "published":"2020-05-05"
        }
    
    def testCommentListGET(self):
        """Test GET request for comments"""
        # add new comment
        new_comment = Comment.objects.create(
            author=self.author1.id,
            comment="Test comment!",
            contentType="text/plain",
            post=self.post
        )
        
        response = self.client.get("/authors/"+str(self.author1.uuid)+"/posts/"+str(self.post.uuid)+"/comments/")

        # check status is 200
        self.assertEqual(response.status_code, 200)

        # Check response has data
        self.assertTrue(len(response.data) > 0)
    

    #to fix
    # def testCommentListPOST(self):
    #     """Test POST request for comments"""

    #     # print(self.comment1)

    #     response = self.client.post("/authors/"+str(self.author1.uuid)+"/posts/"+str(self.post.uuid)+"/comments/", self.comment_data, format="json")

    #     # check status is 200
    #     self.assertEqual(response.status_code, 201)

    #     # Check response has data
    #     self.assertTrue(len(response.data) > 0)

    
class CommentDetailsTest(APITestCase):
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

        self.comment_data = {
            # "type" : "comment",
            "author": self.author_data1,
            "comment": "hello",
            "contentType":"text/plain"
            # "published":"2020-05-05"
        }
    


    def testCommentDetailsGET(self):
        """Test GET for comment"""
        new_comment = Comment.objects.create(
            author=self.author1.id,
            comment="Test comment!",
            contentType="text/plain",
            post=self.post
        )
        response = self.client.get("/authors/"+str(self.author1.uuid)+"/posts/"+str(self.post.uuid)+'/comments/'+str(new_comment.uuid)+'/')

        # check status is 200
        self.assertEqual(response.status_code, 200)

        # Check response has data
        self.assertTrue(len(response.data) > 0)