from contextlib import nullcontext
from rest_framework.pagination import LimitOffsetPagination, PageNumberPagination
from rest_framework.response import Response

class InboxPageNumberPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'size'

    def get_paginated_response(self, data):
        return Response({
            'type': "inbox",
            'author': data[0]['author']['id'],
            'page': self.page.number,
            'size': self.page.paginator.per_page,
            'previous': self.get_previous_link(),
            'next': self.get_next_link(),
            'items': data
        })