import math as m
import random
from decimal import Decimal

from django.contrib.auth.models import Group
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework import filters, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from shop.filters import OrderFilter
from shop.identity.account_service import AccountService
from shop.identity.permissions import PermissionsPerMethodMixin
from shop.models import Order, OrderItem, Product, User, UserLogin
from shop.serializers import OrderSerializer, UserSerializer


class OrderViewSet(
    PermissionsPerMethodMixin,
    viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    #django-filter의 filter 클래스를 통해 필터
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = OrderFilter

    #내림 차순의 경우 필드 명에 -붙이기
    #http://example.com/api/users?ordering=-username
    ordering_fields = '__all__'
    ordering=['-id']

    #관리자 권한 필요
    permission_classes = [permissions.IsAdminUser]

    #로그인 필요
    @action(
        detail=False,
        permission_classes=[permissions.IsAuthenticated])
    def create(self, request, *args, **kwargs):
        """
        주문 등록
        """
        data = request.data

        if data["user_id"] != request.user.id:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        order_items = data["order_items"]
        del data["order_items"]
        del data["user_id"]
        
        data["total_price"] = 0
        data["order_status"] = 0

        order = Order.objects.create(
            user = request.user,
            **data
        )

        total_price = Decimal('0')
        
        #주문의 각 상품 별 가격 계산
        for oi in order_items:
            p = Product.objects.filter(id=oi["product_id"])\
                .first()

            #제품이 없거나, 제품의 재고가 없다면
            if p is None or oi["qty"] > p.stock_count:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            
            decimal100 = Decimal('100')

            #할인 가격
            discountAmount = p.price * p.discount / decimal100

            #할인된 가격을 구한 후 둘째 자리 까지 계산
            price = m.trunc((p.price - discountAmount) * decimal100) \
                / decimal100
            price *= oi["qty"]

            #재고 감소
            p.stock_count -= oi["qty"]

            total_price += price

            p.save()
            OrderItem.objects.create(
                product = p,
                price = price,
                order = order,
                qty = oi["qty"]
            )

        #주문의 전체 가격 업데이트
        order.total_price = total_price
        order.save()

        return Response(
            {
                'orderId': order.id
            },
            status=status.HTTP_201_CREATED
        )
