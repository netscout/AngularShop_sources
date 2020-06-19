from rest_framework import generics
from django_filters import rest_framework as filters
from shop.models import Category, Product

class ProductFilter(filters.FilterSet):
    #name 속성에 대해 일부만 일치하더라도 검색하도록 설정
    name = filters.CharFilter(lookup_expr="icontains")

    #categoryId로 필터링을 요청하는 경우
    #ProductCategory를 참조하는 categories에 대해 필터 수행
    #category_id가 일치하는 항목에 대해 필터링
    categoryId = filters.NumberFilter(
        field_name='categories__category_id',
        lookup_expr='exact'
    )

    class Meta:
        model = Product
        fields = ['name', 'categoryId']

class CategoryFilter(filters.FilterSet):
    #name 속성에 대해 일부만 일치하더라도 검색하도록 설정
    name = filters.CharFilter(lookup_expr="icontains")

    class Meta:
        model = Category
        fields = ['name']