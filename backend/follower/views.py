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

# Create your views here.
class FollowerList(APIView):

    def get(self, request, author_id):
        follower = Follower.objects.get(author=author_id)
        serializer = FollowerSerializer(follower, context={'request':request})
        return Response(serializer.data, status=200)

class FollowerDetails(APIView):

    def get(self, request, author_id, foreign_author_id):
        try:
            follower = Follower.objects.get(author=author_id)
            item = follower.items.get(pk=foreign_author_id)
            serializer = AuthorsSerializer(item, context={'request':request})
            return Response(serializer.data, status=200)
        except:
            return Response("You are not following this user", status=404)
    
    def put(self, request, author_id, foreign_author_id):
        if author_id == foreign_author_id:
            return Response("You cannot follow yourself", status=400)
        try:
            instance = Follower.objects.get(author=author_id)
        except Follower.DoesNotExist:
            instance=None
        
        try:
            author = instance.items.get(pk=foreign_author_id)
            return Response("You are already followed by this user", status=400)
        except Author.DoesNotExist:
            serializer = FollowerSerializer(instance, data=request.data, context={'request':request, 'foreign_author_id': foreign_author_id})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=201)
            else:
                return Response(serializer.errors, status=400)

    def delete(self, request, author_id, foreign_author_id):
        if author_id == foreign_author_id:
            return Response("You cannot perform following actions to yourself", status=400)
        try:
            instance = Follower.objects.get(author=author_id)
        except Follower.DoesNotExist:
            return Response("There's no one to unfollow", status=400)
        try:
            instance.items.remove(foreign_author_id)
            return Response("Unfollow successfully", status=204)
        except Author.DoesNotExist:
            return Response("You cannot unfollow", status=401)