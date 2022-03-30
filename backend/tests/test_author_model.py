# from django.test import TestCase
# from author.models import Author
# from author.serializers import AuthorsSerializer
    
# class AuthorModelTest(TestCase):
#     """Test the Author Model"""

#     def setUp(self):
        
#         # 127.0.0.1:8000 because there is no request being made via the server
#         self.test_dict = {
#              "host" : 'http://127.0.0.1:8000/',
#              "displayName" : "testAuthor",
#              "github" : "https://github.com/CMPUT404W22-GroupProject/social-distribution",
#             }

#         self.author = Author.objects.create(**self.test_dict)
        
#         self.url = "http://127.0.0.1:8000/{0}".format(self.author.uuid)
#         self.author.url = self.url

#     def testAuthorModel(self):
#         """Test all Author fields"""
        
#         self.assertEqual(self.author.type, "author")
#         self.assertEqual(self.author.url, self.url)
#         self.assertEqual(self.author.host, self.test_dict["host"])
#         self.assertEqual(self.author.displayName, self.test_dict["displayName"])
#         self.assertEqual(self.author.github, self.test_dict["github"])

#     def tearDown(self):
#         self.author.delete()