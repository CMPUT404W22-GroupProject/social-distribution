from follower.serializers import FollowRequestSerializerGet
from follower.models import FollowRequest
from inbox.models import Inbox
from comment.models import Comment
from post.models import Post
from author.models import Author
from rest_framework.generics import ListCreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from .pagination import InboxPageNumberPagination
from author.serializers import AuthorsSerializer
from inbox.serializers import InboxSerializer
from follower.serializers import FollowRequestSerializer
from node.authentication import BasicAuthentication
from like.serializers import LikeSerializer


class InboxList(ListCreateAPIView):
    serializer_class = InboxSerializer
    pagination_class = InboxPageNumberPagination
    author_id = None
    basic_auth = BasicAuthentication()

    def get_queryset(self):
        return Inbox.objects.filter(author_id=self.author_id).order_by('-created_date')

    def create_like(self, request):
        request_data = request.data.copy()
        try:
            request_id = request_data['object']
            Post.objects.get(id=request_id)
        except Post.DoesNotExist:
            try:
                Comment.objects.get(id=request_id)
            except:
                return Response("Object doesn't exist", status=404)
        
        try:
            author_data = request_data['author']
            author_url = author_data['id']
            request_data['author'] = author_url
        except:
            return Response("Author info not found", status=404)

        serializer = LikeSerializer(data = request_data, context={'request': request})
        if serializer.is_valid():
            like = serializer.save()
            return (like, serializer.data)
        else:
            return Response(serializer.errors, status = 400)

    # Get inbox
    def list(self, request, author_id):
        # response = self.basic_auth.local_request(request)
        # if response:
        #     return response
        # if not request.user.is_authenticated or author_id != request.user.uuid:
        #     return Response("Forbidden", status=403)

        try:
            try:
                Author.objects.get(pk=author_id)
            except Author.DoesNotExist:
                return Response("Author does not exist", status=404)

            self.author_id = author_id
            queryset = self.filter_queryset(self.get_queryset())
            page = self.paginate_queryset(queryset)
            author5 = Author.objects.get(pk=author_id)
            author = AuthorsSerializer(author5, context={'request': request})
            items = []
            if page is not None:

                serializer = InboxSerializer(queryset, many=True, context={'request': request, 'author': author5})
                for each_object in serializer.data:
                    each_object['author'] = author.data['id']
                    items.append(each_object["items"])

                paginated_items = self.paginate_queryset(items)
                result = {}
                result['type'] = "inbox"
                result['author'] = request.build_absolute_uri().split('/inbox')[0]
                result['items'] = paginated_items

                return self.get_paginated_response(result)

            serializer = InboxSerializer(queryset, many=True, context={
                                        'request': request})
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response( status=400)

    def post(self, request, author_id):
        response = self.basic_auth.remote_request(request)
        if response:
            return response

        request_data = request.data.copy() 

        # This object refers to the original item sent through their id.
        try:
            # If the request type is a post
            if request_data["type"].lower() == "post":
                post_id = request_data["id"]
                new_post = Post.objects.get(id = post_id)

                Inbox.create_object_from_post(new_post, author_id)

            # If the request type is a comment
            elif request_data["type"].lower() == "comment":
                comment_id = request_data["id"]
                new_comment = Comment.objects.get(id=comment_id)
                Inbox.create_object_from_comment(new_comment, author_id)

            # If the request type is a like
            elif request_data["type"].lower() == "like":

                new_like, new_like_data = self.create_like(request)
                Inbox.create_object_from_like(new_like, author_id)

                return Response(new_like_data, status=201)
            
            #If the request type is a follow
            elif request_data["type"].lower() == "follow":
                actor_data = request_data['actor']
                if type(actor_data) is dict:
                    request_data['actor'] = actor_data['id']

                object_data = request_data['object']
                if type(object_data) is dict:
                    request_data['object'] = object_data['id']

                serializer = FollowRequestSerializer(data=request_data, context={'request':request})
                if serializer.is_valid():
                    new_follow_request = serializer.save()
                    Inbox.create_object_from_follow_request(new_follow_request, author_id)
                else:
                    return Response(serializer.errors, status=400)
            
            return Response("Sent to inbox", status=201) 
        except Exception as e:
            return Response("Error", status=400) 

    # Clear inbox
    def delete(self, request, author_id):
        response = self.basic_auth.local_request(request)
        if response:
            return response
        if not request.user.is_authenticated or author_id != request.user.uuid:
            return Response("Forbidden", status=403)
        # INCLUDE PERMISSION CHECKS BEFORE DOING THIS
        author11 = Author.objects.get(pk=author_id)
        try:
            Inbox.objects.filter(author=author11).all().delete()
            return Response("Successfully cleared inbox.", status=201)
        except Inbox.DoesNotExist:
            return Response("No inbox found.", status=401)

class FollowRequestDetails(APIView):

    basic_auth = BasicAuthentication()

    def get(self, request, author_id, follow_request_id):
        response = self.basic_auth.remote_request(request)
        if response:
            return response
        
        try:
            follow_request = FollowRequest.objects.get(pk=follow_request_id)
            serializer = FollowRequestSerializerGet(follow_request, context={'request':request})
            return Response(serializer.data, status=200)
        except:
            return Response("Follow request not found", status=404)


    def delete(self, request, author_id, follow_request_id):
        response = self.basic_auth.local_request(request)
        if response:
            return response
        if not request.user.is_authenticated or author_id != request.user.uuid:
            return Response("Forbidden", status=403)
        
        try:
            follow_request = FollowRequest.objects.get(pk=follow_request_id)
            follow_request.delete()
            return Response("Follow request deleted successfully", status=204)
        except:
            return Response("Follow request not found", status=404)


'''
{
    "type": "comment",
"id":"ce968aa5-0a10-4f98-8206-3df0e5c24a58"
}
'''
