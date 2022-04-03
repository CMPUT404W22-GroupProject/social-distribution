from django.test import TestCase
from node.models import Node
    
class NodeModelTest(TestCase):
    """Test the Node Model"""
    def setUp(self):
        self.test_dict = {
             "username" : 'ModelTest',
             "password" : "ModelPassword",
             "host" : "localserver",
             "is_local": True
            }

        self.node = Node.objects.create(**self.test_dict)

    def testNodeModel(self):
        """Test all Node fields"""
        self.assertEqual(self.node.username, self.test_dict["username"])
        self.assertEqual(self.node.password, self.test_dict["password"])
        self.assertEqual(self.node.host, self.test_dict["host"])
        self.assertEqual(self.node.is_local, self.test_dict["is_local"])

    def tearDown(self):
        self.node.delete()