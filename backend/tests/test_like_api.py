# from rest_framework.test import APITestCase
# from author.models import Author
# from like.models import Like

# class LikeListTest(APITestCase):
#     """Test the LikeList class in views.py"""

#     def setUp(self):
        
#         self.test_dict = {
#             "host" : 'http://127.0.0.1:8000/',
#             "displayName" : "APITest",
#             "github" : "https://github.com/CMPUT404W22-GroupProject/social-distribution",
#         }

#         self.author = Author.objects.create(**self.test_dict)

#         self.like_data = {
#              "author": 1
#         }
    
#     def testViewLike(self):
#         """Test GET request for all like"""
        
#         # Populate list
#         self.client.post("/like/", self.like_data)
        
#         # Check status is ok
#         response = self.client.get("/like/")
#         self.assertEqual(response.status_code, 200)
        
#         # Check response has data
#         self.assertTrue(len(response.data) > 0)

#     def testLikeCreation(self):
#         """Test POST request to create like"""
        
#         # Ensure proper status code
#         response = self.client.post("/like/", self.like_data)
#         self.assertEqual(response.status_code, 201)
        
#         # Ensure it was actually posted
#         response = self.client.get("/like/")
#         print(response.data)
#         self.assertTrue(any(d["summary"] == "APITest likes your post" for d in response.data))
    
#     def tearDown(self):
#         authors = Author.objects.all()
#         authors.delete()
#         like = Like.objects.all()
#         like.delete()
