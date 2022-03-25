from django.http import HttpResponse
from author.models import Author
from rest_framework.views import APIView
from rest_framework.response import Response
from author.serializers import AuthorsSerializer, RegisterSerializer, LoginSerializer
from rest_framework.authtoken.models import Token
from django.contrib.auth import logout
from rest_framework import status, generics, permissions
from django.views.decorators.csrf import csrf_exempt
from .pagination import AuthorPageNumberPagination
from rest_framework.generics import ListCreateAPIView
import os
from urllib.parse import urlparse
import requests
from node.authentication import BasicAuthentication

class AuthorList(ListCreateAPIView):
    # permission_classes = (permissions.IsAuthenticated,)
    serializer_class = AuthorsSerializer
    pagination_class = AuthorPageNumberPagination
    basic_auth = BasicAuthentication()

    def get_queryset(self):
        return Author.objects.all().order_by('displayName')


    # Get all Authors
    def list(self, request): 
        response = self.basic_auth.remote_request(request)
        if response:
            return response
        try:
            queryset = self.filter_queryset(self.get_queryset())
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = AuthorsSerializer(page, many = True, context={'request':request})
                return self.get_paginated_response(serializer.data)
            serializer = AuthorsSerializer(queryset, many=True, context={'request':request})
            return Response(serializer.data, status=200)
        
        except: 
            return Response("Author not found", status=404)

    # Add an Author
    def post(self, request):
        response = self.basic_auth.local_request(request)
        if response:
            return response
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
    # permission_classes = (permissions.IsAuthenticated,)
    basic_auth = BasicAuthentication()

    # Get a specific author
    def get(self, request, author_id):
        
        response = self.basic_auth.remote_request(request)
        if response:
            return response
        # if not request.user.is_authenticated:
        #     return HttpResponse("You must be registered to access this function.", status = 401)
        try:
            author = Author.objects.get(pk=author_id)
            serializer = AuthorsSerializer(author, context={'request':request})
            return Response(serializer.data, status = 200)

        except Author.DoesNotExist:
            return Response("Author not found", status=404)

    # Update an author
    def post(self, request, author_id):

        response = self.basic_auth.local_request(request)
        if response:
            return response
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
        response = self.basic_auth.local_request(request)
        if response:
            return response
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

class LogoutUser(APIView):
    def post(self, request):
        # Delete token if it's there
        try:
            request.user.auth_token.delete()
        except:
            pass 
        
        logout(request)

        return HttpResponse("Successfully logged out.", status=201)