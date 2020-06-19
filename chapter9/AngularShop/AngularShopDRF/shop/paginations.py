from rest_framework.pagination import PageNumberPagination
from collections import OrderedDict
from rest_framework.response import Response

class CustomPageNumberPagination(PageNumberPagination):
    #페이지 번호 쿼리 변수 설정
    page_query_param = 'pageIndex'
    #페이지 크기 쿼리 변수 설정
    page_size_query_param = 'pageSize'

    #페이징 결과 데이터 속성명 설정
    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ('totalCount', self.page.paginator.count),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('data', data)
        ]))