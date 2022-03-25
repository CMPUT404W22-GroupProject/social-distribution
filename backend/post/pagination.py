from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class PostPageNumberPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'size'

    def get_paginated_response(self, data):
        return Response({
            'type': "posts",
            'page': self.page.number,
            'size': self.page.paginator.per_page,
            'count': self.page.paginator.count,
            'items': data
        })