import base64
from rest_framework.test import APITestCase
from author.models import Author
from node.models import Node
from rest_framework.authtoken.models import Token

#https://www.django-rest-framework.org/api-guide/authentication/

class NodeApiTest(APITestCase):

    def setUp(self):
        self.user_data={
            "displayName":"user",
            "email":"user@user.ca",
            "github":"http:/www.google.com"
        }

    def testLocalRequest(self):
        """Test local request for nodes - Token Authentication"""

        #Creating an author object
        user = Author.objects.create(**self.user_data)

        # GET an author to test whether user is not authenticated
        response = self.client.get("/authors/")
        self.assertEqual(response.status_code, 401)
        
        #Token authentication
        # Include an appropriate `Authorization:` header on all requests.
        Token.objects.create(user=user)
        token = Token.objects.get(user=user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

        # GET an author to test whether user is properly authenticated
        response = self.client.get("/authors/")
        self.assertEqual(response.status_code, 200)


    def testRemoteRequest(self):
        """Test local request for nodes - Basic Authentication"""

        #Creating an author object
        user = Author.objects.create(**self.user_data)

        # GET an author to test whether user is not authenticated
        response = self.client.get("/authors/")
        self.assertEqual(response.status_code, 401)

        #Creating a node object and setting basic authentication
        self.node_dict = {
            "username" : "test",
            "password" : "test",
            "host":"local",
            "is_local":"True"
        }
        self.node = Node.objects.create(**self.node_dict)
        self.client.defaults['HTTP_AUTHORIZATION'] = 'Basic ' + base64.b64encode(b"test:test").decode('utf-8')
        self.client.credentials(HTTP_AUTHORIZATION= 'Basic ' + base64.b64encode(b"test:test").decode('utf-8'))

        self.auth_header =  {
            'HTTP_AUTHORIZATION': 'token ' + base64.b64encode(b"test:test").decode('utf-8')
        }

        # GET an author to test whether user is properly authenticated
        response = self.client.get("/authors/")
        self.assertEqual(response.status_code, 200)

