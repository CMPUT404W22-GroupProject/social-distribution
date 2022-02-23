from django.shortcuts import render
from django.http import HttpResponse
from author.models import Author
from like.models import Like
from rest_framework.views import APIView
from rest_framework.response import Response
from like.serializers import LikeSerializer

# Create your views here.
class LikeList(APIView):
    
    # Get all Likes, for all authors, for all posts
    def get(self, request): 
        all_likes = Like.objects.all()
        serializer = LikeSerializer(all_likes, many = True)
        return Response(serializer.data, status = 200)

    # Add a like object
    def post(self, request):
        # Mutable copy
        request_data = request.data.copy()

        serializer = LikeSerializer(data = request_data)
        author = Author.objects.get(pk=serializer.initial_data['author']).displayName
        if serializer.is_valid():
            serializer.save(summary = author + " likes your post")
            return Response(serializer.data, status = 201)
        else:
            return Response(serializer.errors, status = 400)
















class LikedDetails(APIView):
    # We require a author_id to be passed with the request (in the url) to get a user
    
    # Get the likes of a specific author
    def get(self, request, author_id):
        # INCLUDE PERMISSION CHECKS BEFORE DOING THIS
        try:
            liked = Like.objects.filter(author=author_id)
            serializer = LikeSerializer(liked, many=True)
            return Response(serializer.data, status = 200)

        except Like.DoesNotExist:
            return HttpResponse("Author not found.", status = 401)