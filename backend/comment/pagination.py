from rest_framework.pagination import LimitOffsetPagination, PageNumberPagination
from rest_framework.response import Response

class CommentPageNumberPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'size'

    def get_paginated_response(self, data):
        return Response({
            'type': "comments",
            'next': self.get_next_link(),
            'post': data,
            'previous': self.get_previous_link(),
            'count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'page_number': self.page.number,
            'per_page': self.page.paginator.per_page,
            # 'from': self.get_from(),
            # 'to': self.get_to(),
            'comments': data
        })