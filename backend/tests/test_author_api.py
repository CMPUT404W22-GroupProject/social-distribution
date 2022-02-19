from rest_framework.test import APITestCase
from author.models import Author
from django.http import HttpRequest 
from django.urls import reverse

class RegisterUserAPITest(APITestCase):
    def setUp(self):


        self.user_data = {
        "type" : "Author",
        "displayName" : "Tyler",
        "github" : "https://github.com/CMPUT404W22-GroupProject/social-distribution",
        }

        self.register_url = reverse('register')

    def test_register_user(self):
        
        response = self.client.post(self.register_url, self.user_data)
        print(response.data)
        self.assertEqual(response.status_code, 201)
    
        
    def tearDown(self):
        users = Author.objects.all()
        users.delete()