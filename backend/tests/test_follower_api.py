from rest_framework.test import APITestCase
from author.models import Author
from follower.models import Follower
import uuid

class FollowerListTest(APITestCase):
    def setUp(self):

        self.author1 = Author.objects.create(
            email="test1@example.com",
            displayName="APITest1", 
            github="https://github.com/CMPUT404W22-GroupProject/social-distribution"
        )
        self.author2 = Author.objects.create(
            email="test2@example.com",
            displayName="APITest2", 
            github="https://github.com/CMPUT404W22-GroupProject/social-distribution"
        )
        self.author3 = Author.objects.create(
            email="test3@example.com",
            displayName="APITest3", 
            github="https://github.com/CMPUT404W22-GroupProject/social-distribution"
        )
    
    def testFollowerListGET(self):
        """Test GET request for followers"""
        new_follower = Follower.objects.create(
            author=self.author1,
        )
        new_follower.items.set([self.author2, self.author3])

        response = self.client.get("/authors/"+str(self.author1.uuid)+'/followers/')

        # check status is 200
        self.assertEqual(response.status_code, 200)

        # Check there are two followers
        self.assertTrue(len(response.data['items']) == 2)

class FollowerDetails(APITestCase):
    def setUp(self):

        self.author1 = Author.objects.create(
            email="test1@example.com",
            displayName="APITest1", 
            github="https://github.com/CMPUT404W22-GroupProject/social-distribution"
        )
        self.author2 = Author.objects.create(
            email="test2@example.com",
            displayName="APITest2", 
            github="https://github.com/CMPUT404W22-GroupProject/social-distribution"
        )
        self.author3 = Author.objects.create(
            email="test3@example.com",
            displayName="APITest3", 
            github="https://github.com/CMPUT404W22-GroupProject/social-distribution"
        )
        self.follower_data = {
            "author": self.author1.uuid,
            "items": [self.author3.uuid,]
        }
    
    def testFollowerDetailsGET(self):
        """Test GET request for a specific follower"""
        new_follower = Follower.objects.create(
            author=self.author1,
        )
        new_follower.items.set([self.author2])

        response = self.client.get("/authors/"+str(self.author1.uuid)+'/followers/'+str(self.author2.uuid)+'/')

        # check status is 200
        self.assertEqual(response.status_code, 200)

        # Check response has data
        self.assertTrue(len(response.data) > 0)
    
    def testFollowerDetailsPUT(self):
        """Test PUT request for a specific follower"""
        new_follower = Follower.objects.create(
            author=self.author1,
        )
        new_follower.items.set([self.author2])
        # allow author2 to follow author1
        response = self.client.put("/authors/"+str(self.author1.uuid)+'/followers/'+str(self.author3.uuid)+'/', self.follower_data)

        # check status is 201
        self.assertEqual(response.status_code, 201)

        # Check response has data
        self.assertTrue(len(response.data) > 0)
    
    def testFollowerDetailsDELETE(self):
        """Test DELETE request for a specific follower"""
        new_follower = Follower.objects.create(
            author=self.author1,
        )
        new_follower.items.set([self.author2])

        response = self.client.delete("/authors/"+str(self.author1.uuid)+'/followers/'+str(self.author2.uuid)+'/')

        # check status is 204
        self.assertEqual(response.status_code, 204)