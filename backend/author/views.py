from django.http import HttpResponse
from author.models import Author
from rest_framework.views import APIView
from rest_framework.response import Response
from author.serializers import AuthorsSerializer

class AuthorList(APIView):
    
    # Add an Author
    def post(self, request):
        
        # Mutable copy
        request_data = request.data.copy()

        serializer = AuthorsSerializer(data = request_data)
        if serializer.is_valid():
            print(serializer.validated_data)
            serializer.save()
            return Response(serializer.data, status = 201)
        else:
            return Response(serializer.errors, status = 400)

    # Get all Authors
    def get(self, request):
        
        # INCLUDE PERMISSION CHECKS BEFORE DOING THIS
        # EX: return HttpResponse("You do not have permission to access this function.", status=403)

        all_authors = Author.objects.all()
        serializer = AuthorsSerializer(all_authors, many = True)
        return Response(serializer.data, status = 200)


class AuthorDetails(APIView):
    # We require a user_id to be passed with the request (in the url) to get a user
    
    # Get a specific author
    def get(self, request, user_id):

        # INCLUDE PERMISSION CHECKS BEFORE DOING THIS

        try:
            author = Author.objects.get(pk=user_id)
            serializer = AuthorsSerializer(author)
            return Response(serializer.data, status = 200)

        except Author.DoesNotExist:
            return HttpResponse("Author not found.", status = 401)

    # Update an author
    def put(self, request, user_id):

        # INCLUDE PERMISSION CHECKS BEFORE DOING THIS

        try:
            author = Author.objects.get(pk=user_id)
        except  Author.DoesNotExist:
            return HttpResponse("Author not found.", status=401)

        request_data = request.data.copy()

        # Handle image change
        # !!!!! UNCOMMENT WHEN IMAGES ARE BEING STORED !!!!!
        # delete_image = False
        # old_image = Author.profileImage
        # new_image = request_data.get("profileImage")
        # if new_image != old_image:
        #     # set flag to delete image manually
        #     delete_image = True

        serializer = AuthorsSerializer(author, data = request_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            author.save() # !!!!! DELETE WHEN BELOW IS UNCOMMENTED !!!!!

            # delete image manually
            # !!!!! UNCOMMENT WHEN IMAGES ARE BEING STORED !!!!!
            # if delete_image:
            #     if old_image and os.path.isfile(old_image.path):
            #         os.remove(old_image.path)
                # author.save()

            return Response(serializer.data, status=200)
        else:
            return Response(serializer.errors, status=400)

    # Delete an author
    def delete(self, request, user_id):

        # INCLUDE PERMISSION CHECKS BEFORE DOING THIS

        try:
            author = Author.objects.get(pk=user_id)
            author.delete()
            return HttpResponse("Successfully deleted the Author.", status=201)

        except  Author.DoesNotExist:
            return HttpResponse("Author not found.", status=401) 