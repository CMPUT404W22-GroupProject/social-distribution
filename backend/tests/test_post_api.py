from rest_framework.test import APITestCase
from author.models import Author
from django.http import HttpRequest
import json
from PIL import Image
import tempfile

# class PostListTest(APITestCase):
#     """Test PostList class in views.py"""

#     def setUp(self):
#         self.author = Author.objects.create(
#             displayName="APITest", 
#             github="https://github.com/CMPUT404W22-GroupProject/social-distribution"
#         )

#         self.post_data = {
#             "title": "Test title for Post",
#             "description": "This is a description",
#             "contentType": "text/plain",
#             "content": "This is a test content",
#             "author": self.author.id,
#             "categories": "Category1,Category2",
#             "published": 

#         }
    
#     def testViewPost(self):
#         """Test GET request for all posts for author 1"""

#         # Populate list
#         self.client.post("/posts/", self.post_data)

#         # Check status is ok