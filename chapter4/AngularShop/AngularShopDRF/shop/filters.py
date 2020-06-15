from rest_framework import generics
from django_filters import rest_framework as filters
from shop.models import Product

class ProductFilter(filters.FilterSet):
    #name 속성에 대해 일부만 일치하더라도 검색하도록 설정
    name = filters.CharFilter(lookup_expr="icontains")

    class Meta:
        model = Product
        fields = ['name']