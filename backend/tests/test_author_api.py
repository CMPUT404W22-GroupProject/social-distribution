import base64
from rest_framework.test import APITestCase
from author.models import Author
from node.models import Node
from PIL import Image
import tempfile
from rest_framework.authtoken.models import Token

#https://www.django-rest-framework.org/api-guide/authentication/

class AuthorListTest(APITestCase):
    """Test the AuthorList class in views.py"""

    def setUp(self):
        image = Image.new('RGB', (123, 123))
        temp = tempfile.NamedTemporaryFile(suffix='.jpg')
        image.save(temp)
        temp.seek(0)
        
        # #Creating a node object and setting authentication
        # self.node_dict = {
        #     "username" : "test",
        #     "password" : "test",
        #     "host":"local",
        #     "is_local":"True"
        # }
        # self.node = Node.objects.create(**self.node_dict)
        # self.client.defaults['HTTP_AUTHORIZATION'] = 'Basic ' + base64.b64encode(b"test:test").decode('utf-8')
        # self.client.credentials(HTTP_AUTHORIZATION= 'Basic ' + base64.b64encode(b"test:test").decode('utf-8'))

        # self.auth_header =  {
        #     'HTTP_AUTHORIZATION': 'token ' + base64.b64encode(b"test:test").decode('utf-8')
        # }

        self.user_data={
            "displayName":"user",
            "email":"user@user.ca",
            "github":"http:/www.google.com"
        }
        user = Author.objects.create(**self.user_data)
        # Include an appropriate `Authorization:` header on all requests.
        Token.objects.create(user=user)
        token = Token.objects.get(user=user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

        self.author_data = {
        "displayName" : "APITest",
        "email":"apitest@user.ca",
        "github" : "https://github.com/CMPUT404W22-GroupProject/social-distribution"
        }
    
    def testViewAuthors(self):
        """Test GET request for all authors"""
        
        # Populate list
        self.client.post("/authors/", self.author_data)
        
        
        # Check status is ok
        response = self.client.get("/authors/")
        self.assertEqual(response.status_code, 200)
        
        # Check response has data
        self.assertTrue(response.data["count"] > 0)

    def testAuthorCreation(self):
        """Test POST request to create author"""
        
        # Ensure proper status code
        response = self.client.post("/authors/", self.author_data)
        self.assertEqual(response.status_code, 201)
        
        # Ensure it was actually posted
        response = self.client.get("/authors/")
        self.assertTrue(any(d["displayName"] == "APITest" for d in response.data["items"]))
    
    def tearDown(self):
        authors = Author.objects.all()
        authors.delete()
        node = Node.objects.all()
        node.delete()
        token = Token.objects.all()
        token.delete()

class AuthorDetailsTest(APITestCase):
    """Test the AuthorDetails class in views.py"""

    def setUp(self):
        
        image = Image.new('RGB', (123, 123))
        temp = tempfile.NamedTemporaryFile(suffix='.jpg')
        image.save(temp)
        temp.seek(0)
        
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
        # Include an appropriate `Authorization:` header on all requests.
        Token.objects.create(user=user)
        token = Token.objects.get(user=user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

        self.author_data = {
        "displayName" : "APITest",
        "email":"apitest@user.ca",
        "github" : "https://github.com/CMPUT404W22-GroupProject/social-distribution"
        }
        
        # Get object and it's id
        response = self.client.post("/authors/", self.author_data)
        self.author_id = response.data["id"].split("/")[-1]
        
        # What the host and url should be for automated test
        self.host = 'http://testserver/'
        self.url = 'http://testserver/authors/{0}'.format(self.author_id)

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
        self.assertEqual(response.data["host"]+"/", self.host)
        # self.assertNotEqual(response.data["profileImage"], None)

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
        self.assertEqual(response.status_code, 404)
    
    def tearDown(self):
        authors = Author.objects.all()
        authors.delete()
        node = Node.objects.all()
        node.delete()
        token = Token.objects.all()
        token.delete()