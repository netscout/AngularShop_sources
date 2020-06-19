from shop.models import Category
from shop.serializers import CategorySerializer, RecursiveCategorySerializer
from shop.paginations import CustomPageNumberPagination
from rest_framework import filters, permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework.backends import DjangoFilterBackend
from shop.filters import CategoryFilter
from django.db.models import Count

class CategoryViewSet(viewsets.ModelViewSet):
    """
    ModelViewSet은 특정 모델에 대해서
    list(GET), create(POST), retrieve(GET), 
    update(PUT), destroy(DELETE)를 기본으로 제공함
    """
    #ViewSet에서 사용할 데이터 목록 설정
    #products로 참조되는 데이터 개수를 total_products로 조회
    #이렇게 조회해야 total_products필드에 대해 정렬 가능
    queryset = Category.objects.annotate(
        total_products=Count('products'))
    #ViewSet에서 사용할 직렬화 / 역직렬화 클래스 설정
    serializer_class = CategorySerializer
    #ViewSet에서 사용할 페이징 클래스 설정
    pagination_class = CustomPageNumberPagination

    #DjangoFilterBackend를 통해 기본 필터링을 설정
    #OrderingFilter를 통해 정렬 설정
    #http://example.com/api/Products?name=스마트
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = CategoryFilter
    
    #정렬에 사용할 필드를 전체 필드로 설정
    ordering_fields = '__all__'
    #내림 차순의 경우 필드 명에 -붙이기
    #http://example.com/api/Products?ordering=-id
    ordering=['-id']

    #관리자만 접근 가능
    permission_classes = [permissions.IsAdminUser]

    #분류 추가 / 수정시 중복 검사
    @action(detail=False)
    def is_dupe_field(self, request, *args, **kwargs):
        id = request.query_params["categoryId"]
        field_value = request.query_params["fieldValue"]
        c = Category.objects\
            .filter(name=field_value)\
            .exclude(id=id)\
            .first()
        
        return Response(c is not None)

    #전체 분류 트리 조회
    @action(detail=False)
    def get_entire_category_tree(self, request, *args, **kwargs):
        c_set = Category.objects.filter(parent_id=None)

        return Response(
            [RecursiveCategorySerializer(c).data for c in c_set])