from django.http import HttpResponse
from node.models import Node
from rest_framework.response import Response
import base64
# https://djangosnippets.org/snippets/2468/
class BasicAuthentication:

    def unauthed(self):
        response = HttpResponse("""<html><title>Auth required</title><body>
                                <h1>Authorization Required</h1></body></html>""")
        response['WWW-Authenticate'] = 'Basic realm="Development"'
        response.status_code = 401
        return Response("You are not authorized", status=401)
    
    def remote_request(self, request):
        host = request.META['HTTP_HOST'].split(':')[0]
        if host == "localhost" or host == "127.0.0.1" or host == "cmput-404-w22-group-10-backend.herokuapp.com":
            return None
        
        try:
            node = Node.objects.get(host=host)
            if node.is_local == True:
                return
        except Node.DoesNotExist:
            return Response("Forbidden access", status=403)


        if 'HTTP_AUTHORIZATION' not in request.META:
            return self.unauthed()
        else:
            authentication = request.META['HTTP_AUTHORIZATION']
            (authmeth, auth) = authentication.split(' ',1)
            if 'basic' != authmeth.lower():
                return self.unauthed()

            auth = base64.b64decode(auth.strip()).decode("utf-8")

            username, password = auth.split(':',1)

            if username == node.username and password == node.password:
                return None
            else:
                return self.unauthed()

            
    
    def local_request(self, request):
        host = request.META['HTTP_HOST'].split(':')[0]
        if host == "localhost" or host == "127.0.0.1" or host == "cmput-404-w22-group-10-backend.herokuapp.com":
            return None
        
        try:
            node = Node.objects.get(host=host)
            if node.is_local == True:
                return
        except Node.DoesNotExist:
            return Response("Forbidden access", status=403)