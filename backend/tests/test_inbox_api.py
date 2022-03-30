# from distutils.cmd import Command
# from comment.models import Comment
# from rest_framework.test import APITestCase
# from author.models import Author
# from like.models import Like
# from inbox.models import Inbox

# from PIL import Image
# import tempfile
# from post.models import Post

# class InboxListTest(APITestCase):
#     """Test the InboxList class in views.py"""
#     # Inbox is being tested using a LIKE object.
#     # Same process for any other object type.
#     def setUp(self):
#         self.author = Author.objects.create(
#             email="test@example.com",
#             displayName="APITest", 
#             github="https://github.com/CMPUT404W22-GroupProject/social-distribution"
#         )
#         self.post = Post.objects.create(
#             title="Test title for editing Post",
#             description="This is a edit description",
#             contentType="text/plain",
#             content="This is a test content",
#             author=self.author,
#             categories="Category3,Category4",
#             visibility="FRIENDS",
#             unlisted=True,
#         )

#         self.like = Like.objects.create(
#             context = "https://www.w3.org/ns/activitystreams",
#             summary = "APITest likes your post", 
#             type = "Like",
#             author = self.author,
#             object = self.post
#         )

#         #Inbox requires only "type" and "id" of the object
#         self.inbox_data = {
#         "type":"like",
#         "id": self.like.id, 
#         } 
        
#     def testViewInbox(self):
#         """Test GET request for inbox"""
        
#         # Populate list

#         #Creating inbox object from like object
#         Inbox.create_object_from_like(self.like)

#         # Check status is ok
#         response = self.client.get("/authors/" + str(self.author.uuid) + "/inbox")
#         self.assertEqual(response.status_code, 200)
        
#         # Check response has data
#         self.assertTrue(len(response.data) > 0)




#     def testLikeCreation(self):
#         """Test POST request to create an inbox object"""
        
#         # Ensure proper status code
#         response = self.client.post("/authors/" + str(self.author.uuid) + "/inbox", self.inbox_data)
#         self.assertEqual(response.status_code, 201)
        
#         # Ensure it was actually posted
#         response = self.client.get("/authors/" + str(self.author.uuid) + "/inbox")
#         self.assertEqual(len(response.data["items"]), 1)
   

#     def testInboxClear(self):
#         """Test DELETE request to clear inbox"""

#         # Ensure object is present before deletion
#         response = self.client.get("/authors/" + str(self.author.uuid) +"/inbox")
#         self.assertEqual(response.status_code, 200)

#         # Remove object
#         response = self.client.delete("/authors/" + str(self.author.uuid) +"/inbox")
#         self.assertEqual(response.status_code, 201)

#         # Ensure object was removed
#         response = self.client.get("/authors/" + str(self.author.uuid) +"/inbox")
#         self.assertEqual(len(response.data["items"]), 0)


#     def tearDown(self):
#         authors = Author.objects.all()
#         authors.delete()
#         posts = Post.objects.all()
#         posts.delete()
#         like = Like.objects.all()
#         like.delete()
#         inbox = Inbox.objects.all()
#         inbox.delete()