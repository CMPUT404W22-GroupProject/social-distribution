from django.http import HttpResponse
from node.models import Node
from rest_framework.response import Response
import base64
import requests
from urllib.parse import urlparse
from requests.auth import HTTPBasicAuth
# https://djangosnippets.org/snippets/2468/
class BasicAuthentication:

    def unauthed(self):
        response = HttpResponse("""<html><title>Auth required</title><body>
                                <h1>Authorization Required</h1></body></html>""")
        response['WWW-Authenticate'] = 'Basic realm="Development"'
        response.status_code = 401
        return response
    
    def remote_request(self, request):
        # host = request.META['HTTP_HOST'].split(':')[0]
        # if host == "localhost" or host == "127.0.0.1" or host == "cmput-404-w22-group-10-backend.herokuapp.com":
        #     return None
        if 'HTTP_AUTHORIZATION' not in request.META:
            return self.unauthed()
        else:
            authentication = request.META['HTTP_AUTHORIZATION']
            (authmeth, auth) = authentication.split(' ',1)
            if 'basic' != authmeth.lower():
                return self.unauthed()

            auth = base64.b64decode(auth.strip()).decode("utf-8")
            username, password = auth.split(':',1)

            try:
                node = Node.objects.get(username=username)
                if node.password == password:
                    return
                else:
                    return self.unauthed()

            except Node.DoesNotExist:
                return self.unauthed()

            
    
    def local_request(self, request):
        # host = request.META['HTTP_HOST'].split(':')[0]
        # if host == "localhost" or host == "127.0.0.1" or host == "cmput-404-w22-group-10-backend.herokuapp.com":
        #     return None

        if 'HTTP_AUTHORIZATION' not in request.META:
            return self.unauthed()
        else:
            authentication = request.META['HTTP_AUTHORIZATION']
            (authmeth, auth) = authentication.split(' ',1)
            if 'basic' != authmeth.lower():
                return self.unauthed()

            auth = base64.b64decode(auth.strip()).decode("utf-8")

            username, password = auth.split(':',1)

            try:
                node = Node.objects.get(username=username)
                if node.password == password:
                    if node.is_local == True:
                        return
                return self.unauthed()

            except Node.DoesNotExist:
                return self.unauthed()
        
    def get_request(self, url):
        host = urlparse(url).hostname
        if host == 'localhost' or host == '127.0.0.1' or host == 'cmput-404-w22-group-10-backend.herokuapp.com/':
            return None
        elif host == "backend-404.herokuapp.com":
            username = 'Team10'
            password = 'abcdefg'
        elif host == "cmput-404-w22-project-group09.herokuapp.com":
            username = 'group10'
            password = 'pwd1010'
        else:
            username = ''
            password = ''
        
        return requests.get(url, auth=HTTPBasicAuth(username, password))