from unittest import TestResult
from django.test import TestCase
from author.models import Author
from author.serializers import AuthorsSerializer
    
class AuthorModelTest(TestCase):
    """Test the Author Model"""

    def setUp(self):
        
        self.test_dict = {
             "displayName" : "testAuthor",
             "github" : "https://github.com/CMPUT404W22-GroupProject/social-distribution",
            }

        # Create an Author via Serializer
        serializer = AuthorsSerializer(data = self.test_dict)
        if serializer.is_valid():
            serializer.save()
            author_id = serializer.data["id"]
            self.author = Author.objects.get(pk = author_id)
            self.host = 'http://127.0.0.1:8000/'
            self.url = 'http://127.0.0.1:8000/{0}'.format(author_id)

    def testAuthorModel(self):
        """Test all Author fields"""
        
        self.assertEqual(self.author.type, "author")
        self.assertEqual(self.author.url, self.url)
        self.assertEqual(self.author.host, self.host)
        self.assertEqual(self.author.displayName, self.test_dict["displayName"])
        self.assertEqual(self.author.github, self.test_dict["github"])

    def tearDown(self):
        self.author.delete()