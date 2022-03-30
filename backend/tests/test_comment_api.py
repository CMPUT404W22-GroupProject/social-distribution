# from rest_framework.test import APITestCase
# from author.models import Author
# from post.models import Post
# from comment.models import Comment
# from node.models import Node
# import base64


# class CommentListTest(APITestCase):
#     def setUp(self):
#         #Creating a node object and setting authentication
#         self.node_dict = {
#             "username" : "test",
#             "password" : "test",
#             "host":"local",
#             "is_local":"True"
#         }
#         Node.objects.create(**self.node_dict)
#         self.client.credentials(HTTP_AUTHORIZATION= 'Basic ' + base64.b64encode(b"test:test").decode('utf-8'))

#         self.author = Author.objects.create(
#             # email="test@example.com",
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
        
#         # "/authors/"+str(self.author.uuid)+"/posts/"+str(self.post.uuid)+"/comments"
#         self.comment_data = {
#             "author": self.author,
#             "comment": "Test comment",
#             "contentType": "commonMark",
#             "published" : "2020-05-05",
#             "post": self.post.uuid,
#         }

    
#     def testCommentListGET(self):
#         """Test GET request for comments"""
#         # add new comment
#         new_comment = Comment.objects.create(
#             author=self.author,
#             comment="Test comment!",
#             contentType="text/plain",
#             post=self.post
#         )
#         print(new_comment.post)
#         response = self.client.get("/authors/"+str(self.author.uuid)+"/posts/"+str(self.post.uuid)+"/comments/")
#         print(response.data)

#         # check status is 200
#         self.assertEqual(response.status_code, 200)

#         # Check response has data
#         self.assertTrue(len(response.data) > 0)
    
    # def testCommentListPOST(self):
    #     """Test POST request for comments"""

    #     # print(self.comment1)

    #     response = self.client.post("/authors/"+str(self.author.uuid)+"/posts/"+str(self.post.uuid)+'/comments/', self.comment_data)

    #     # check status is 200
    #     self.assertEqual(response.status_code, 201)

    #     # Check response has data
    #     self.assertTrue(len(response.data) > 0)

    
# class CommentDetailsTest(APITestCase):
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
#         self.comment_data = {
#             "author": self.author.uuid,
#             "comment": "Test comment",
#             "contentType": "commonMark",
#             "post": self.post.uuid,
#         }
    
#     def testCommentDetailsGET(self):
#         """Test GET for comment"""
#         new_comment = Comment.objects.create(
#             author=self.author,
#             comment="Test comment!",
#             contentType="text/plain",
#             post=self.post,
#         )
#         response = self.client.get("/authors/"+str(self.author.uuid)+"/posts/"+str(self.post.uuid)+'/comments/'+str(new_comment.uuid)+'/')

#         # check status is 200
#         self.assertEqual(response.status_code, 200)

#         # Check response has data
#         self.assertTrue(len(response.data) > 0)