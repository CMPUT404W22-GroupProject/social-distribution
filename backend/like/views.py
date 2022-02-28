from ast import arg
from django.shortcuts import render
from django.http import HttpResponse
from author.models import Author
from post.models import Post
from comment.models import Comment
from like.models import Like
from rest_framework.views import APIView
from rest_framework.response import Response
from like.serializers import LikeSerializer

# Create your views here.
class LikeList(APIView):
    
    # Get all Likes, for all authors
    def get(self, request, author_id, post_id, comment_id=""): 
        all_likes = Like.objects.all()
        serializer = LikeSerializer(all_likes, many = True)
        result = []
        if comment_id=="":
            print("ITS A POST")
            #If it is a POST
            for each_object in serializer.data:
                if each_object['summary'].split(" ")[-1] == "comment":
                    continue
                level = {}
                author = Author.objects.get(pk=each_object['author']).toString()
                for each_item in each_object:
                    if each_item =="context":
                        level["@context"] = each_object[each_item]
                    elif each_item != "author" and each_item!="object1":
                        level[each_item] = each_object[each_item]
                    elif each_item=="author":
                        level[each_item]= author
                result.append(level)
        else:
            #If it's a COMMENT
            print("COMMENT")
            for each_object in serializer.data:
                if each_object['summary'].split(" ")[-1] == "post":
                    continue
                level = {}
                author = Author.objects.get(pk=each_object['author']).toString()
                for each_item in each_object:
                    if each_item =="context":
                        level["@context"] = each_object[each_item]
                    elif each_item=="object1":
                        level["object"] = each_object[each_item]
                    elif each_item != "author" and each_item!="object":
                        level[each_item] = each_object[each_item]
                    elif each_item=="author":
                        level[each_item]= author
                result.append(level)
        return Response(result, status = 200)


    # # Get all Likes, for all authors, for all COMMENTS
    # def get(self, request, author_id, post_id, comment_id): 
    #     all_likes = Like.objects.all()
    #     serializer = LikeSerializer(all_likes, many = True)
    #     result = []
    #     for each_object in serializer.data:
    #         if each_object['summary'].split(" ")[-1] == "post":
    #             continue
    #         level = {}
    #         author = Author.objects.get(pk=each_object['author']).toString()
    #         for each_item in each_object:
    #             if each_item =="context":
    #                 level["@context"] = each_object[each_item]
    #             elif each_item=="object1":
    #                 level["object"] = each_object[each_item]
    #             elif each_item != "author" and each_item!="object":
    #                 level[each_item] = each_object[each_item]
    #             else:
    #                 level[each_item]= author
    #         result.append(level)
    #     return Response(result, status = 200)

    # Add a like object FOR POSTS
    def post(self, request, author_id, post_id, comment_id=""):
        # Mutable copy
        if comment_id=="":
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
        else:
            # Mutable copy
            request_data = request.data.copy()
            serializer = LikeSerializer(data = request_data)
            author1 = Author.objects.get(pk=serializer.initial_data['author'])
            comment1 = Comment.objects.get(pk=comment_id)

            if serializer.is_valid():
                serializer.save(summary = author1.displayName + " likes your comment")
                serializer.save(author = author1)
                serializer.save(object1 = comment1)
                return Response(serializer.data, status = 201)
            else:
                return Response(serializer.errors, status = 400)


    # # Add a like object FOR COMMENTS
    # def post(self, request, author_id, post_id, comment_id):
    #     # Mutable copy
    #     request_data = request.data.copy()
    #     serializer = LikeSerializer(data = request_data)
    #     author1 = Author.objects.get(pk=serializer.initial_data['author'])
    #     comment1 = Comment.objects.get(pk=comment_id)

    #     if serializer.is_valid():
    #         serializer.save(summary = author1.displayName + " likes your comment")
    #         serializer.save(author = author1)
    #         serializer.save(object1 = comment1)
    #         return Response(serializer.data, status = 201)
    #     else:
    #         return Response(serializer.errors, status = 400)


class LikedDetails(APIView):
    # We require a author_id to be passed with the request (in the url) to get a like object
    
    # Get the likes of a specific author
    def get(self, request, author_id, post_id, like_id, comment_id=""):
        # INCLUDE PERMISSION CHECKS BEFORE DOING THIS
        if comment_id == "":
        
            #FOR POSTS
            try:
                like = Like.objects.get(pk=like_id)
                serializer = LikeSerializer(like)
                result = {}
                author = Author.objects.get(pk=author_id).toString()
                for each_object in serializer.data:
                    if each_object =="context":
                        result["@context"] = serializer.data["context"]
                    elif each_object != "author" and each_object!="object1":
                        result[each_object] = serializer.data[each_object]
                    elif each_object == "author":
                        result[each_object]= author
                return Response(result, status = 200)
            except Like.DoesNotExist:
                return HttpResponse("Like not found.", status = 401)
        else:
            #FOR COMMENTS
            try:
                like = Like.objects.get(pk=like_id)
                serializer = LikeSerializer(like)
                result = {}
                author = Author.objects.get(pk=author_id).toString()
                for each_object in serializer.data:
                    if each_object =="context":
                        result["@context"] = serializer.data[each_object]
                    elif each_object == "object1":
                        result["object"]=serializer.data[each_object]
                    elif each_object != "author" and each_object!="object":
                        result[each_object] = serializer.data[each_object]
                    elif each_object == "author":
                        result[each_object]= author
                return Response(result, status = 200)
            except Like.DoesNotExist:
                return HttpResponse("Like not found.", status = 401)


    #Unlike a post
    def delete(self, request, author_id, post_id, like_id, comment_id=""):
        # INCLUDE PERMISSION CHECKS BEFORE DOING THIS
        if comment_id=="":
            #FOR POSTS
            try:
                like = Like.objects.get(pk=like_id)
                like.delete()
                return HttpResponse("Successfully unliked the post.", status=201)
            except  Like.DoesNotExist:
                return HttpResponse("Like object not found.", status=401) 
        else:
            try:
                like = Like.objects.get(pk=like_id)
                like.delete()
                return HttpResponse("Successfully unliked the comment.", status=201)
            except  Like.DoesNotExist:
                return HttpResponse("Like object not found.", status=401) 

    # #For comments
    # # Get the likes of a specific author
    # def get(self, request, author_id, post_id, comment_id, like_id):
    #     # INCLUDE PERMISSION CHECKS BEFORE DOING THIS
    #     try:
    #         like = Like.objects.get(pk=like_id)
    #         serializer = LikeSerializer(like)
    #         result = {}
    #         author = Author.objects.get(pk=author_id).toString()
    #         for each_object in serializer.data:
    #             if each_object =="context":
    #                 result["@context"] = serializer.data[each_object]
    #             elif each_object == "object1":
    #                 result["object"]=serializer.data[each_object]
    #             elif each_object != "author" and each_object!="object":
    #                 result[each_object] = serializer.data[each_object]
    #             else:
    #                 result[each_object]= author
    #         return Response(result, status = 200)
    #     except Like.DoesNotExist:
    #         return HttpResponse("Like not found.", status = 401)

    # def delete(self, request, author_id, post_id, comment_id, like_id):
    #     # INCLUDE PERMISSION CHECKS BEFORE DOING THIS
    #     try:
    #         like = Like.objects.get(pk=like_id)
    #         like.delete()
    #         return HttpResponse("Successfully unliked the comment.", status=201)
    #     except  Like.DoesNotExist:
    #         return HttpResponse("Like object not found.", status=401) 
