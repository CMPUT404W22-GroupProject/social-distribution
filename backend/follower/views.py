from django.http import HttpResponse
from author.models import Author
from follower.models import Follower
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from author.serializers import AuthorsSerializer
from follower.serializers import FollowerSerializer, FollowerSerializerGet
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.mixins import LoginRequiredMixin
import os
from urllib.parse import urlparse
import requests
from node.authentication import BasicAuthentication
from requests.auth import HTTPBasicAuth

# Create your views here.
class FollowerList(APIView):
    basic_auth = BasicAuthentication()

    def get(self, request, author_id):
        response = self.basic_auth.remote_request(request)
        if response:
            return response

        try:
            follower = Follower.objects.filter(author=author_id)
            if not follower:
                return Response("Follower not found", status=404)

            serializer = FollowerSerializerGet(follower, many=True, context={'request':request})
            items = []
            for each_object in serializer.data:
                items.append(each_object['object'])
            
            result = {}
            result['type'] = "followers"
            result['items'] =items

            return Response(result, status=200)

        except Follower.DoesNotExist:
            return Response("Follower not found", status=404)

class FollowerDetails(APIView, LoginRequiredMixin):
    basic_auth = BasicAuthentication()

    def get(self, request, author_id, foreign_author_id):
        response = self.basic_auth.remote_request(request)
        if response:
            return response

        items = Follower.objects.filter(author=author_id)

        for item in items:
            follower_id = item.object.split('authors/')[1].split('/')[0]
            if follower_id == str(foreign_author_id):
                serializer = FollowerSerializerGet(item, context={'request':request})
                return Response(serializer.data, status=200)

        return Response("Follow not found", status=404)

    
    def put(self, request, author_id, foreign_author_id):
        response = self.basic_auth.local_request(request)
        if response:
            return response
        if not request.user.is_authenticated or author_id != request.user.uuid:
            return Response("Forbidden", status=403)

        if author_id == foreign_author_id:
            return Response("You cannot follow yourself", status=400)

        request_data = request.data.copy()

        if request_data['type'].lower() != "follow":
            return Response("Incorrect object passed", status=400)

        try:
            author_id = request_data['object']['id']
            author = Author.objects.get(id=author_id)
            request_data['author'] = author.uuid
            request_data.pop('object', None)

        except Author.DoesNotExist:
            return Response("Author does not exist", status=404)
        try:
            request_data['type'] = "follower"
            request_data.pop('summary', None)

            follower_id = request_data['actor']['id']
            follower_uuid = follower_id.split('authors/')[1].split('/')[0]

            if follower_uuid != str(foreign_author_id):
                return Response("Bad request", status=400)

            try:
                author = Author.objects.get(id=follower_id)
            except:
                return Response("Follower not found", status=404)

            request_data['object'] = follower_id
            request_data.pop('actor', None)
        
            serializer = FollowerSerializer(data=request_data, context={'request':request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=201)
            else:
                return Response(serializer.errors, status = 400)
        
        except Exception as e:
            return Response("Follower action failed", status=400)



    def delete(self, request, author_id, foreign_author_id):
        response = self.basic_auth.local_request(request)
        if response:
            return response
        if not request.user.is_authenticated or author_id != request.user.uuid:
            return Response("Forbidden", status=403)
            
        if author_id == foreign_author_id:
            return Response("You cannot perform following actions to yourself", status=400)
        
        items = Follower.objects.filter(author=author_id)
        for item in items:
            follower_id = item.object.split('authors/')[1].split('/')[0]
            if follower_id == str(foreign_author_id):
                item.delete()
                return Response("Unfollow successfully", status=204)

        return Response("You cannot unfollow", status=401)