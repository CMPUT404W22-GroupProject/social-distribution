from django.http import HttpResponse
from author.models import Author
from follower.models import Follower
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from author.serializers import AuthorsSerializer
from follower.serializers import FollowerSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.mixins import LoginRequiredMixin
import os
from urllib.parse import urlparse
import requests

# Create your views here.
class FollowerList(APIView):

    def get(self, request, author_id):
        try:
            follower = Follower.objects.get(author=author_id)
            serializer = FollowerSerializer(follower, context={'request':request})
            return Response(serializer.data, status=200)

        except Follower.DoesNotExist:

            full_url = request.build_absolute_uri()
            hostname = urlparse(full_url).hostname
            if hostname == "localhost" or hostname == "127.0.0.1":
                return Response("Follower not found", status=404)
            else:
                response = requests.get(full_url)
                if response.status_code == 200:
                    return Response(response.json(), status=200)
                else:
                    return Response("Follower not found", status=404)

class FollowerDetails(APIView, LoginRequiredMixin):

    def get(self, request, author_id, foreign_author_id):
        try:
            follower = Follower.objects.get(author=author_id)
            item = follower.items.get(pk=foreign_author_id)
            serializer = AuthorsSerializer(item, context={'request':request})
            return Response(serializer.data, status=200)
        except:
            full_url = request.build_absolute_uri()
            hostname = urlparse(full_url).hostname
            if hostname == "localhost" or hostname == "127.0.0.1":
                return Response("You are not followed by this user", status=404)
            else:
                response = requests.get(full_url)
                if response.status_code == 200:
                    return Response(response.json(), status=200)
                else:
                    return Response("Follower not found", status=404)

    
    def put(self, request, author_id, foreign_author_id):
        if author_id == foreign_author_id:
            return Response("You cannot follow yourself", status=400)
        try:
            author = Author.objects.get(pk=author_id)
            new_follower = Author.objects.get(pk=foreign_author_id)
        except Author.DoesNotExist:
            return Response("Author does not exist", status=404)
        try:
            instance = Follower.objects.get(author=author_id)
            instance.items.add(new_follower)
        except Follower.DoesNotExist:
            instance = Follower.objects.create(author=author, items=[])
            instance.items.set(new_follower)
        
        serializer = FollowerSerializer(instance, context={'request':request})
        return Response(serializer.data, status=201)



    def delete(self, request, author_id, foreign_author_id):
        if author_id == foreign_author_id:
            return Response("You cannot perform following actions to yourself", status=400)
        try:
            instance = Follower.objects.get(author=author_id)
        except Follower.DoesNotExist:
            return Response("There's no one to unfollow", status=400)
        try:
            instance.items.remove(foreign_author_id)
            instance.save()
            return Response("Unfollow successfully", status=204)
        except Author.DoesNotExist:
            return Response("You cannot unfollow", status=401)