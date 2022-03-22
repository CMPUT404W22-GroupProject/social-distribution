from rest_framework.pagination import LimitOffsetPagination, PageNumberPagination
from rest_framework.response import Response

class CommentPageNumberPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'size'

    def get_paginated_response(self, data):
        post_uri = data[0]['id'].split('/comments')[0]
        comment_uri = post_uri + '/comments'
        return Response({
            'type': "comments",
            'page': self.page.number,
            'size': self.page.paginator.per_page,
            'previous': self.get_previous_link(),
            'next': self.get_next_link(),
            'post': post_uri,
            'id': comment_uri,
            'comments': data
        })