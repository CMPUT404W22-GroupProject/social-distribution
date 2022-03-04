from importlib.resources import path
from re import L
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
    def checkErors(self, author_id, post_id, comment_id):
        try:
            Author.objects.get(pk=author_id)
        except Author.DoesNotExist:
            return HttpResponse("Author not found", status=404)
        try:
            Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return HttpResponse("Post not found", status=404)
        try:
            if comment_id!="":
                Comment.objects.get(pk=comment_id)
        except Comment.DoesNotExist:
            return HttpResponse("Comment not found", status=404)

    def get(self, request, author_id, post_id, comment_id=""): 
        self.checkErors(author_id,post_id, comment_id)
        author11 = Author.objects.get(pk=author_id)
        post11 = Post.objects.get(pk=post_id)

        if comment_id!="":
            comment11 = Comment.objects.get(pk=comment_id)
            all_likes = Like.objects.filter(author=author11, object = post11, object1 = comment11).all()
            if not all_likes:
                return Response({}, status = 200)
        else:
            all_likes = Like.objects.filter(author=author11, object = post11).all()
            if not all_likes:
                return Response({}, status = 200)


        # Creating the links to objects
        http_host = request.META.get('HTTP_HOST')
        if http_host[0]!="h":
            http_host = "http://"+http_host
        path_info = request.META.get('PATH_INFO')
        post_object = http_host
        for each_detail in path_info.split("/"):
            if each_detail == "likes":
                break
            if each_detail != "":
                post_object = post_object + "/" + each_detail

        serializer = LikeSerializer(all_likes, many = True)
        result = []
        if comment_id=="":
            #If it is a POST
            for each_object in serializer.data:
                if not each_object['object']:
                    continue
                level = {}
                author = Author.objects.get(pk=each_object['author']).toString()
                for each_item in each_object:
                    if each_item =="context":
                        level["@context"] = each_object[each_item]
                    elif each_item=="id":
                        level[each_item] = http_host+path_info+"/"+str(each_object[each_item])
                    elif each_item=="object":
                        level[each_item] = post_object
                    elif each_item != "author" and each_item!="object1":
                        level[each_item] = each_object[each_item]
                    elif each_item=="author":
                        level[each_item]= author
                result.append(level)
        else:
            #If it's a COMMENT
            for each_object in serializer.data:
                if not each_object['object1']:
                    continue
                level = {}
                author = Author.objects.get(pk=each_object['author']).toString()
                for each_item in each_object:
                    if each_item =="context":
                        level["@context"] = each_object[each_item]
                    elif each_item=="object1":
                        level["object"] = post_object
                    elif each_item=="id": 
                        level[each_item] = http_host+path_info+"/"+str(each_object[each_item])
                    elif each_item != "author" and each_item!="object":
                        level[each_item] = each_object[each_item]
                    elif each_item=="author":
                        level[each_item]= author
                result.append(level)
        return Response(result, status = 200)

    # Add a like object FOR POSTS
    def post(self, request, author_id, post_id, comment_id=""):
        self.checkErors(author_id,post_id, comment_id)
        # Mutable copy
        request_data = request.data.copy()
        serializer = LikeSerializer(data = request_data)
        author1 = Author.objects.get(pk=serializer.initial_data['author'])
        post1 = Post.objects.get(pk=post_id)

        if serializer.is_valid():
            if comment_id=="":
                serializer.save(summary = author1.displayName + " likes your post")
                serializer.save(object = post1)
            else:
                comment1 = Comment.objects.get(pk=comment_id)
                serializer.save(summary = author1.displayName + " likes your comment")
                serializer.save(object = post1, object1 = comment1)
            serializer.save(author = author1)
            
            return Response(serializer.data, status = 201)
        else:
            return Response(serializer.errors, status = 400)

class LikedDetails(APIView):
    # We require a author_id, post_id, and/or comment_id to be passed with the request (in the url) to get a like object
    def checkErrors(self, author_id, post_id, like_id, comment_id=""):
        try:
            Author.objects.get(pk=author_id)
        except Author.DoesNotExist:
            return HttpResponse("Author not found", status=404)
        try:
            Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return HttpResponse("Post not found", status=404)
        try:
            if comment_id!="":
                Comment.objects.get(pk=comment_id)
        except Comment.DoesNotExist:
            return HttpResponse("Comment not found", status=404)
        try:
            Like.objects.get(pk=like_id)
        except Like.DoesNotExist:
            return HttpResponse("Like not found", status=404)

    def get(self, request, author_id, post_id, like_id, comment_id=""):
        self.checkErrors(author_id, post_id, like_id, comment_id)
        http_host = request.META.get('HTTP_HOST')
        if http_host[0]!="h":
            http_host = "http://"+http_host
        path_info = request.META.get('PATH_INFO').split("/")
        post_object = http_host
        for each_detail in path_info:
            if each_detail == "likes":
                break
            if each_detail != "":
                post_object = post_object + "/" + each_detail
        # INCLUDE PERMISSION CHECKS BEFORE DOING THIS
        like = Like.objects.get(pk=like_id)
        serializer = LikeSerializer(like)
        result = {}
        author = Author.objects.get(pk=author_id).toString()
        try:
            for each_object in serializer.data:
                if each_object =="context":
                    result["@context"] = serializer.data[each_object]
                elif each_object == "object1" and comment_id != "":
                    result["object"]= post_object
                elif each_object == "object" and comment_id=="":
                    result[each_object] = post_object
                elif (each_object != "author" and each_object!="object" and each_object!="id"
                    and not (each_object == "object" and comment_id!="") and not (each_object == "object1" and comment_id == "")):
                    result[each_object] = serializer.data[each_object]
                elif each_object == "author":
                    result[each_object]= author
            return Response(result, status = 200)
        except Like.DoesNotExist:
            return HttpResponse("Like not found.", status = 401)


    #Unlike a post or comment
    def delete(self, request, author_id, post_id, like_id, comment_id=""):
        self.checkErrors(author_id, post_id, like_id, comment_id)
        # INCLUDE PERMISSION CHECKS BEFORE DOING THIS
        try:
            like = Like.objects.get(pk=like_id)
            like.delete()
            if comment_id=="":
                return HttpResponse("Successfully unliked the post.", status=201)
            else:
                return HttpResponse("Successfully unliked the comment.", status=201)
        except  Like.DoesNotExist:
            return HttpResponse("Like object not found.", status=401) 

