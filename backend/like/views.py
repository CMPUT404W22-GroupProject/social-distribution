from django.shortcuts import render
from django.http import HttpResponse
from author.models import Author
from post.models import Post
from like.models import Like
from rest_framework.views import APIView
from rest_framework.response import Response
from like.serializers import LikeSerializer

# Create your views here.
class LikeList(APIView):
    
    # Get all Likes, for all authors, for all posts
    def get(self, request, author_id, post_id): 
        all_likes = Like.objects.all()
        serializer = LikeSerializer(all_likes, many = True)
        result = []
        for each_object in serializer.data:
            level = {}
            author = Author.objects.get(pk=each_object['author']).toString()
            for each_item in each_object:
                if each_item =="context":
                    level["@context"] = each_object["context"]
                elif each_item != "author":
                    level[each_item] = each_object[each_item]
                else:
                    level[each_item]= author
            result.append(level)
       
        return Response(result, status = 200)

    # Add a like object
    def post(self, request, author_id, post_id):
        # Mutable copy
        request_data = request.data.copy()
        serializer = LikeSerializer(data = request_data)
        author1 = Author.objects.get(pk=serializer.initial_data['author'])
        post1 = Post.objects.get(pk=post_id)

        if serializer.is_valid():
            serializer.save(summary = author1.displayName + " likes your post")
            serializer.save(author = author1)
            serializer.save(object = post1)
            return Response(serializer.data, status = 201)
        else:
            return Response(serializer.errors, status = 400)


class LikedDetails(APIView):
    # We require a author_id to be passed with the request (in the url) to get a like object
    
    # Get the likes of a specific author
    def get(self, request, author_id, post_id, like_id):
        # INCLUDE PERMISSION CHECKS BEFORE DOING THIS
        try:
            like = Like.objects.get(pk=like_id)
            serializer = LikeSerializer(like)
            result = {}
            author = Author.objects.get(pk=author_id).toString()
            for each_object in serializer.data:
                if each_object =="context":
                    result["@context"] = serializer.data["context"]
                elif each_object != "author":
                    result[each_object] = serializer.data[each_object]
                else:
                    result[each_object]= author
            return Response(result, status = 200)
        except Like.DoesNotExist:
            return HttpResponse("Like not found.", status = 401)


    #Unlike a post
    def delete(self, request, author_id, post_id, like_id):

        # INCLUDE PERMISSION CHECKS BEFORE DOING THIS

        try:
            like = Like.objects.get(pk=like_id)
            like.delete()
            return HttpResponse("Successfully unliked the post.", status=201)
        except  Like.DoesNotExist:
            return HttpResponse("Like object not found.", status=401) 