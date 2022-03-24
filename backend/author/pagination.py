from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class AuthorPageNumberPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'size'

    def get_paginated_response(self, data):
        return Response({
            'type': "authors",
            'page': self.page.number,
            'size': self.page.paginator.per_page,
            'items': data
        })