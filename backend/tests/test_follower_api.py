from rest_framework.test import APITestCase
from author.models import Author
from author.serializers import AuthorsSerializer
from follower.models import Follower
import uuid 
from rest_framework.authtoken.models import Token


class FollowerListTest(APITestCase):
    def setUp(self):

        self.author1={
            "displayName":"user1",
            "email":"user1@user.ca",
            "github":"http:/www.google.com"
        }

        self.author2={
            "displayName":"user2",
            "email":"user2@user.ca",
            "github":"http:/www.google.com"
        }

        self.author1 = AuthorsSerializer.ignoreMethod(self, validated_data = self.author1)
        self.author2 = AuthorsSerializer.ignoreMethod(self, validated_data = self.author2)

        #Authenticating author1
        Token.objects.create(user=self.author1)
        self.token = Token.objects.get(user=self.author1)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    
    def testFollowerListGET(self):
        """Test GET request for followers"""
        new_follower = Follower.objects.create(
            author=self.author1,
            object = self.author2.id
        )
        response = self.client.get("/authors/"+str(self.author1.uuid)+'/followers/')

        # check status is 200
        self.assertEqual(response.status_code, 200)

        # Check there are two followers
        self.assertTrue(len(response.data['items']) == 1)

class FollowerDetails(APITestCase):
    def setUp(self):

        self.author1={
            "displayName":"user1",
            "email":"user1@user.ca",
            "github":"http:/www.google.com"
        }
        self.author2={
            "displayName":"user2",
            "email":"user2@user.ca",
            "github":"http:/www.google.com"
        }

        self.author1 = AuthorsSerializer.ignoreMethod(self, validated_data = self.author1)
        self.author2 = AuthorsSerializer.ignoreMethod(self, validated_data = self.author2)

        self.author_data1 = {
            "type": "author",
            "id":  self.author1.id,
            "host":  self.author1.host,
            "displayName":  self.author1.displayName,
            "url":  self.author1.url,
            "github":  self.author1.github,
            "profileImage":  self.author1.profileImage
        }

        self.author_data2 = {
            "type": "author",
            "id":  self.author2.id,
            "host":  self.author2.host,
            "displayName":  self.author2.displayName,
            "url":  self.author2.url,
            "github":  self.author2.github,
            "profileImage":  self.author2.profileImage
        }

        #Authenticating author1
        Token.objects.create(user=self.author1)
        self.token = Token.objects.get(user=self.author1)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
    
    def testFollowerDetailsGET(self):
        """Test GET request for a specific follower"""
        new_follower = Follower.objects.create(
            author=self.author1,
            object = self.author2.id
        )

        response = self.client.get("/authors/"+str(self.author1.uuid)+'/followers/'+str(self.author2.uuid))

        # check status is 200
        self.assertEqual(response.status_code, 200)

        # Check response has data
        self.assertTrue(len(response.data) > 0)
    
    # def testFollowerDetailsPUT(self):
    #     """Test PUT request for a specific follower"""
    #     # new_follower = Follower.objects.create(
    #     #     author=self.author1,
    #     #     object = self.author2.id
    #     # )

    #     self.follower_data = {
    #         "type":"follow",
    #         "summary":"User2 wants to follow User1",
    #         "actor": self.author_data2,
    #         "object": self.author_data1
    #     }

    #     # allow author2 to follow author1
    #     response = self.client.put("/authors/"+str(self.author1.uuid)+'/followers/'+str(self.author2.uuid), self.follower_data, format="json")

    #     # check status is 201
    #     self.assertEqual(response.status_code, 201)

    #     # Check response has data
    #     self.assertTrue(len(response.data) > 0)
    
    def testFollowerDetailsDELETE(self):
        """Test DELETE request for a specific follower"""
        new_follower = Follower.objects.create(
            author=self.author1,
            object = self.author2.id
        )

        response = self.client.delete("/authors/"+str(self.author1.uuid)+'/followers/'+str(self.author2.uuid))

        # check status is 204
        self.assertEqual(response.status_code, 204)

    def tearDown(self):
        authors = Author.objects.all()
        authors.delete()
        token = Token.objects.all()
        token.delete()
        follow = Follower.objects.all()
        follow.delete()