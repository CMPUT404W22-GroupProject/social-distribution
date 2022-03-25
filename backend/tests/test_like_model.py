# from django.test import TestCase
# from author.models import Author
# from like.models import Like
# from author.serializers import AuthorsSerializer
    
# class LikeModelTest(TestCase):
#     """Test the Like Model"""

#     def setUp(self):
        
#         #Creating Author First
#         self.test_dict_author = {
#              "host" : 'http://127.0.0.1:8000/',
#              "displayName" : "testAuthor",
#              "github" : "https://github.com/CMPUT404W22-GroupProject/social-distribution",
#             }

#         self.author = Author.objects.create(**self.test_dict_author)
#         self.url = "http://127.0.0.1:8000/{0}".format(self.author.id)
#         self.author.url = self.url



#         #Like
#         '''
#         WHEN POSTING THROUGH REST, USE {author: id} ONLY
#         AUTHOR OBJECT AND SUMMARY IS HANDLED THROUGH VIEWS
#         e.g {
#          "author" : 1
#          }
#         '''

#         self.test_dict_like = {
#              "author": self.author,
#              "summary": self.author.displayName + " likes your post"
#             }

#         self.like = Like.objects.create(**self.test_dict_like)
#         self.summary = self.author.displayName + " likes your post"
#         self.like_author = self.author.toString()
#         self.type = "Like"
#         self.context = "https://www.w3.org/ns/activitystreams"

#     def testLikeModel(self):
#         self.assertEqual(self.like.type, self.type)
#         self.assertEqual(self.like.context, self.context)
#         self.assertEqual(self.like.summary, self.summary)
#         self.assertEqual(self.like.author, self.author)
       
#     def tearDown(self):
#         self.author.delete()
#         self.like.delete()