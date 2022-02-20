from rest_framework.test import APITestCase
from author.models import Author
from django.http import HttpRequest
import json
from PIL import Image
import tempfile

class AuthorListTest(APITestCase):
    """Test the AuthorList class in views.py"""

    def setUp(self):
        
        self.author_data = {
        "displayName" : "APITest",
        "github" : "https://github.com/CMPUT404W22-GroupProject/social-distribution",
        }
    
    def testViewAuthors(self):
        """Test GET request for all authors"""
        
        # Populate list
        self.client.post("/authors/", self.author_data)
        
        # Check status is ok
        response = self.client.get("/authors/")
        self.assertEqual(response.status_code, 200)
        
        # Check response has data
        self.assertTrue(len(response.data) > 0)

    def testAuthorCreation(self):
        """Test POST request to create author"""
        
        # Ensure proper status code
        response = self.client.post("/authors/", self.author_data)
        self.assertEqual(response.status_code, 201)
        
        # Ensure it was actually posted
        response = self.client.get("/authors/")
        self.assertTrue(any(d["displayName"] == "APITest" for d in response.data))
    
    def tearDown(self):
        authors = Author.objects.all()
        authors.delete()

class AuthorDetailsTest(APITestCase):
    """Test the AuthorDetails class in views.py"""

    def setUp(self):
        
        self.author_data = {
        "displayName" : "APITest",
        "github" : "https://github.com/CMPUT404W22-GroupProject/social-distribution",
        }
        
        # Get object and it's id
        response = self.client.post("/authors/", self.author_data)
        self.author_id = response.data["id"]
        
        # What the host and url should be for automated test
        self.host = 'http://127.0.0.1:8000/'
        self.url = 'http://127.0.0.1:8000/{0}'.format(self.author_id)

    def testAuthorDetails(self):
        """Test GET request for author's details"""
        
        # Check status code
        response = self.client.get("/authors/{0}/".format(self.author_id))
        self.assertEqual(response.status_code, 200)
        
        # Check details
        self.assertEqual(response.data["type"], "author")
        self.assertEqual(response.data["displayName"], self.author_data["displayName"])
        self.assertEqual(response.data["github"], self.author_data["github"])
        self.assertEqual(response.data["url"], self.url)
        self.assertEqual(response.data["host"], self.host)

    def testAuthorUpdate(self):
        """Test POST request for author updating"""
        
        # Field we want to change
        self.changed_data = {
            "displayName" : "ChangedValueTest",
            "type": "notAuthor"
        }

        # Check status code 
        response = self.client.post("/authors/{0}/".format(self.author_id), self.changed_data)
        self.assertEqual(response.status_code, 200)
       
        # Check for content change
        self.assertEqual(response.data["displayName"], self.changed_data["displayName"])
        
        # Check to make sure type didnt change
        self.assertNotEqual(response.data["type"], self.changed_data["type"])

    def testAuthorDelete(self):
        """Test DELETE request for author deletion"""
        
        # Ensure object is present before deletion
        response = self.client.get("/authors/{0}/".format(self.author_id))
        self.assertEqual(response.status_code, 200)

        # Remove object
        response = self.client.delete("/authors/{0}/".format(self.author_id))
        self.assertEqual(response.status_code, 201)
        
        # Ensure object was removed
        response = self.client.get("/authors/{0}/".format(self.author_id))
        self.assertEqual(response.status_code, 401)
    
    def tearDown(self):
        authors = Author.objects.all()
        authors.delete()