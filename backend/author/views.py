from django.http import HttpResponse
from author.models import Author
from rest_framework.views import APIView
from rest_framework.response import Response
from author.serializers import AuthorsSerializer
import os

class AuthorList(APIView):
    
    # Get all Authors
    def get(self, request): 
        # if not request.user.is_authenticated:
        #     return HttpResponse("You must be registered to access this function.", status = 401)


        all_authors = Author.objects.all()
        serializer = AuthorsSerializer(all_authors, many = True, context={'listRequest':request})
        return Response(serializer.data, status = 200)

    # Add an Author
    def post(self, request):
        
        # Mutable copy
        request_data = request.data.copy()

        serializer = AuthorsSerializer(data = request_data, context={'listRequest':request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = 201)
        else:
            return Response(serializer.errors, status = 400)


class AuthorDetails(APIView):
    # We require a author_id to be passed with the request (in the url) to get a user
    
    # Get a specific author
    def get(self, request, author_id):
        
        # if not request.user.is_authenticated:
        #     return HttpResponse("You must be registered to access this function.", status = 401)

        try:
            author = Author.objects.get(pk=author_id)
            serializer = AuthorsSerializer(author, context={'detailsRequest':request})
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



        serializer = AuthorsSerializer(author, data = request_data, partial=True, context={'detailsRequest':request})
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