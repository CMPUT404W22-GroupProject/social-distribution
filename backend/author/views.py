from django.http import HttpResponse
from author.models import Author
from rest_framework.views import APIView
from rest_framework.response import Response

from author.serializers import AuthorsSerializer, RegisterSerializer, LoginSerializer
from rest_framework.authtoken.models import Token
from rest_framework import status

from author.serializers import AuthorsSerializer
from rest_framework import generics, permissions
from django.views.decorators.csrf import csrf_exempt
import os


class AuthorList(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    # Get all Authors
    def get(self, request): 
        # if not request.user.is_authenticated:
        #     return HttpResponse("You must be registered to access this function.", status = 401)
        all_authors = Author.objects.all()
        serializer = AuthorsSerializer(all_authors, many = True, context={'request':request})
        return Response(serializer.data, status = 200)

    # Add an Author
    def post(self, request):
        
        # Mutable copy
        request_data = request.data.copy()

        serializer = AuthorsSerializer(data = request_data, context={'request':request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = 201)
        else:
            return Response(serializer.errors, status = 400)


class AuthorDetails(APIView):
    # We require a author_id to be passed with the request (in the url) to get a user
    permission_classes = (permissions.IsAuthenticated,)
    # Get a specific author
    def get(self, request, author_id):
        
        # if not request.user.is_authenticated:
        #     return HttpResponse("You must be registered to access this function.", status = 401)

        try:
            author = Author.objects.get(pk=author_id)
            serializer = AuthorsSerializer(author, context={'request':request})
            return Response(serializer.data, status = 200)

        except Author.DoesNotExist:
            return HttpResponse("Author not found.", status = 401)

    # Update an author
    def post(self, request, author_id):

        # if not request.user.is_authenticated:
        #     return HttpResponse("You must be registered to access this function.", status = 401)

        try:
            author = Author.objects.get(pk=author_id)
        except  Author.DoesNotExist:
            return HttpResponse("Author not found.", status=401)

        request_data = request.data.copy()

        serializer = AuthorsSerializer(author, data = request_data, partial=True, context={'request':request})
        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=200)
        else:
            return Response(serializer.errors, status=400)

    # Delete an author
    def delete(self, request, author_id):

        # if not request.user.is_authenticated:
        #     return HttpResponse("You must be registered to access this function.", status = 401)

        try:
            author = Author.objects.get(pk=author_id)
            author.delete()
            return HttpResponse("Successfully deleted the Author.", status=201)

        except  Author.DoesNotExist:
            return HttpResponse("Author not found.", status=401) 

class RegisterUser(APIView):
    #Register a new users
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            author = serializer.save()
            return Response({
                "user" : serializer.data,
                "token": Token.objects.create(user=author).key

             }, status=status.HTTP_201_CREATED)
        if Author.objects.filter(email__iexact=request.data['email']).exists():
            return Response({"Status 0": "User with this email already exist"}, status=status.HTTP_409_CONFLICT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginUser(APIView):
    #allows users created to login.
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            author = serializer.validated_data
            # add additional user info to response
            serialized_data = serializer.data
            serialized_data["uuid"] = author.uuid
            serialized_data["displayName"] = author.displayName
            serialized_data.pop("password")
            
            return Response({
                "user" : serialized_data,
                "token": Token.objects.create(user=author).key

             }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)