from django.test import TestCase
from follower.models import Follower, FollowRequest
from author.models import Author
from rest_framework.authtoken.models import Token

    
class FollowerModelTest(TestCase):
    """Test the Follower Model"""
    def setUp(self):
        #The first user who is following the second user
        self.follower_data={
            "displayName":"user",
            "email":"user@user.ca",
            "github":"http:/www.google.com"
        }
        self.follower = Author.objects.create(**self.follower_data)
        
        #The second user who is being followed by the first user
        self.being_followed_data = {
        "displayName" : "APITest",
        "email":"apitest@user.ca",
        "github" : "https://github.com/CMPUT404W22-GroupProject/social-distribution"
        }
        self.being_followed = Author.objects.create(**self.being_followed_data)

        self.test_dict = {
             "type" : 'ModelTest',
             "author" : self.follower,
             "object" : self.being_followed,
            }
        self.follow_object = Follower.objects.create(**self.test_dict)

    def testNodeModel(self):
        """Test all Follower fields"""
        self.assertEqual(self.follow_object.type, self.test_dict["type"])
        self.assertEqual(self.follow_object.author, self.test_dict["author"])
        self.assertEqual(self.follow_object.object, self.test_dict["object"])

    def tearDown(self):
        self.follow_object.delete()



class FollowRequestModelTest(TestCase):
    """Test the Follower Model"""
    def setUp(self):
        #The first user who is following the second user
        self.follower_data={
            "displayName":"user",
            "email":"user@user.ca",
            "github":"http:/www.google.com"
        }
        self.follower = Author.objects.create(**self.follower_data)
        
        #The second user who is being followed by the first user
        self.being_followed_data = {
        "displayName" : "APITest",
        "email":"apitest@user.ca",
        "github" : "https://github.com/CMPUT404W22-GroupProject/social-distribution"
        }
        self.being_followed = Author.objects.create(**self.being_followed_data)

        self.test_dict = {
             "type" : 'ModelTest',
             "actor" : self.follower,
             "object" : self.being_followed,
             "summary" : "First user wants to follow you"
            }
        self.follow_request_object = FollowRequest.objects.create(**self.test_dict)

    def testNodeModel(self):
        """Test all Follower fields"""
        self.assertEqual(self.follow_request_object.type, self.test_dict["type"])
        self.assertEqual(self.follow_request_object.actor, self.test_dict["actor"])
        self.assertEqual(self.follow_request_object.object, self.test_dict["object"])
        self.assertEqual(self.follow_request_object.summary, self.test_dict["summary"])


    def tearDown(self):
        self.follow_request_object.delete()