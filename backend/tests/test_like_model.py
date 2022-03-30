# from django.test import TestCase
# from author.models import Author
# from like.models import Like
# from post.models import Post
# from author.serializers import AuthorsSerializer
# from comment.models import Comment

    
# class LikeModelTest(TestCase):
#     """Test the Like Model"""

#     def setUp(self):
        
#         self.author = Author.objects.create(
#             email="test@example.com",
#             displayName="APITest", 
#             github="https://github.com/CMPUT404W22-GroupProject/social-distribution"
#         )

#         self.post_data = {
#             "title": "Test title for Post",
#             "description": "This is a description",
#             "contentType": "text/plain",
#             "content": "This is a test content",
#             "author": self.author,
#             "categories": "Category1,Category2",
#             "visibility": "FRIENDS",
#             "unlisted": False,
#         }
#         self.post = Post.objects.create(**self.post_data)

#         self.comment_data = {
#             "author": self.author,
#             "comment": "Test comment",
#             "contentType": "commonMark",
#             "post": self.post,
#         }
#         self.comment  = Comment.objects.create(**self.comment_data)


#         #Liking a post
#         self.like_data_post = {
#             "context":"https://www.w3.org/ns/activitystreams",
#             "summary": "APITest likes your post", 
#             "type":"Like",
#             "author":self.author,
#             "object":self.post
#         }
#         self.like_post  = Like.objects.create(**self.like_data_post)


#         #Liking a comment
#         self.like_data_comment = {
#             "context":"https://www.w3.org/ns/activitystreams",
#             "summary": "APITest likes your post", 
#             "type":"Like",
#             "author":self.author,
#             "object":self.post,
#             "object1":self.comment
#         }
#         self.like_comment  = Like.objects.create(**self.like_data_comment)


#     def testLikeModel(self):
#         """Test all Like fields"""

#         #For posts
#         self.assertEqual(self.like_post.context, self.like_data_post["context"])
#         self.assertEqual(self.like_post.summary, self.like_data_post["summary"])
#         self.assertEqual(self.like_post.type, self.like_data_post["type"])
#         self.assertEqual(self.like_post.author, self.like_data_post["author"])
#         self.assertEqual(self.like_post.object, self.like_data_post["object"])
#         self.assertEqual(self.like_post.object1, None)

#         #For comments
#         self.assertEqual(self.like_comment.context, self.like_data_comment["context"])
#         self.assertEqual(self.like_comment.summary, self.like_data_comment["summary"])
#         self.assertEqual(self.like_comment.type, self.like_data_comment["type"])
#         self.assertEqual(self.like_comment.author, self.like_data_comment["author"])
#         self.assertEqual(self.like_comment.object, self.like_data_comment["object"])
#         self.assertEqual(self.like_comment.object1, self.like_data_comment["object1"])


#     def tearDown(self):
#         self.author.delete()
#         self.like_post.delete()
#         self.like_comment.delete()
