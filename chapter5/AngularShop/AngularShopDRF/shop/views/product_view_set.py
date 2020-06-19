from shop.models import Maker, Product, Category, ProductCategory,\
    ProductImage
from shop.serializers import MakerSerializer, ProductSerializer
from shop.paginations import CustomPageNumberPagination
from rest_framework import viewsets, filters
from rest_framework.response import Response
from rest_framework.decorators import action
import decimal
from django_filters.rest_framework.backends import DjangoFilterBackend
from shop.filters import ProductFilter

class ProductViewSet(viewsets.ModelViewSet):
    """
    ModelViewSet은 특정 모델에 대해서
    list(GET), create(POST), retrieve(GET), 
    update(PUT), destroy(DELETE)를 기본으로 제공함
    """
    #ViewSet에서 사용할 데이터 목록 설정
    queryset = Product.objects.all()
    #ViewSet에서 사용할 직렬화 / 역직렬화 클래스 설정
    serializer_class = ProductSerializer
    #ViewSet에서 사용할 페이징 클래스 설정
    pagination_class = CustomPageNumberPagination

    #DjangoFilterBackend를 통해 기본 필터링을 설정
    #OrderingFilter를 통해 정렬 설정
    #http://example.com/api/Products?name=스마트
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = ProductFilter
    
    #정렬에 사용할 필드를 전체 필드로 설정
    ordering_fields = '__all__'
    #내림 차순의 경우 필드 명에 -붙이기
    #http://example.com/api/Products?ordering=-id
    ordering=['-id']

    #ViewSet에서 기본 제공되는 액션 외에 추가로 정의하는 액션
    #detail=True 설정시 접근 url : ~~/{pk}/{함수 명}
    #detail=False 설정시 접근 url : ~~/{함수 명}
    @action(detail=False)
    def generate_products(self, request):
        #제조 회사 데이터 정의
        maker1 = Maker(name="모바일 메이커1")
        maker2 = Maker(name="기타 메이커2")

        #제품 분류 정의
        root_electric = Category(
                name = "전자제품"
        )
        middle_mobile = Category(
                name = "모바일",
                parent = root_electric
        )
        middle_etc = Category(
                name = "기타",
                parent = root_electric
        )
        middle_onsale = Category(
                name = "세일",
                parent = root_electric
        )
        leaf_smartphone = Category(
                name = "스마트폰",
                parent = middle_mobile
        )

        leaf_tablet = Category(
                name = "태블릿",
                parent = middle_mobile
        )
        leaf_notebook = Category(
                name = "노트북",
                parent = root_electric
        )

        #제품 데이터 정의
        p1 = self.generate_product("스마트폰1", maker1)
        pc1 = ProductCategory(
            category=leaf_smartphone,
            product=p1
        )
        pi1 = ProductImage(
            photo_url = "images/products/product_1.jpg",
            product = p1
        )

        p2 = self.generate_product("음향기기1", maker2)
        pc2 = ProductCategory(
            category=middle_etc,
            product=p2
        )
        pi2 = ProductImage(
            photo_url = "images/products/product_2.jpg",
            product = p2
        )

        p3 = self.generate_product("악세사리1", maker2)
        pc3 = ProductCategory(
            category=middle_etc,
            product=p3
        )
        pi3 = ProductImage(
            photo_url = "images/products/product_3.jpg",
            product = p3
        )

        p4 = self.generate_product("노트북1", maker1)
        pc4 = ProductCategory(
            category=leaf_notebook,
            product=p4
        )
        pi4 = ProductImage(
            photo_url = "images/products/product_4.jpg",
            product = p4
        )

        p5 = self.generate_product("헤드폰1", maker2)
        pc5 = ProductCategory(
            category=middle_etc,
            product=p5
        )
        pi5 = ProductImage(
            photo_url = "images/products/product_5.jpg",
            product = p5
        )

        p6 = self.generate_product("태블릿1", maker1)
        pc6 = ProductCategory(
            category=leaf_tablet,
            product=p6
        )
        pi6 = ProductImage(
            photo_url = "images/products/product_6.jpg",
            product = p6
        )

        p7 = self.generate_product("스마트폰2", maker1)
        pc7 = ProductCategory(
            category=leaf_smartphone,
            product=p7
        )
        pi7 = ProductImage(
            photo_url = "images/products/product_7.jpg",
            product = p7
        )

        p8 = self.generate_product("키보드1", maker2)
        pc8 = ProductCategory(
            category=middle_etc,
            product=p8
        )
        pi8 = ProductImage(
            photo_url = "images/products/product_8.jpg",
            product = p8
        )

        p9 = self.generate_product("드론1", maker2)
        pc9 = ProductCategory(
            category=middle_etc,
            product=p9
        )
        pi9 = ProductImage(
            photo_url = "images/products/product_9.jpg",
            product = p9
        )

        p10 = self.generate_product("헤드폰2", maker2)
        pc10 = ProductCategory(
            category=middle_etc,
            product=p10
        )
        pi10 = ProductImage(
            photo_url = "images/products/product_10.jpg",
            product = p10
        )

        p11 = self.generate_product("게임콘솔1", maker2)
        pc11 = ProductCategory(
            category=middle_etc,
            product=p11
        )
        pi11 = ProductImage(
            photo_url = "images/products/product_11.jpg",
            product = p11
        )

        p12 = self.generate_product("렌즈1", maker2)
        pc12 = ProductCategory(
            category=middle_etc,
            product=p12
        )
        pi12 = ProductImage(
            photo_url = "images/products/product_12.jpg",
            product = p12
        )
        
        makers = [maker1, maker2]
        for m in makers:
            #이름이 중복되는 제조 회사가 없다면 추가
            if Maker.objects.filter(name=m.name).first() is None:
                m.save()

        categories = [
            root_electric,
            middle_mobile,
            middle_etc,
            middle_onsale,
            leaf_notebook,
            leaf_smartphone,
            leaf_tablet
        ]
        for c in categories:
            if Category.objects.filter(name=c.name).first() is None:
                c.save()
        
        products = [
            p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12
        ]

        addedProductCount = 0

        for p in products:
            #이름이 중복되는 제품이 없다면 추가
            if Product.objects.filter(name=p.name).first() is None:
                p.save()
                addedProductCount += 1
        
        if addedProductCount == 12:
            productCategories = [
                pc1, pc2, pc3, pc4, pc5, pc6, pc7, pc8, pc9, pc10, pc11, pc12
            ]

            for pc in productCategories:
                pc.save()

            productImages = [
                pi1, pi2, pi3, pi4, pi5, pi6, pi7, pi8, pi9, pi10, pi11, pi12
            ]

            for pi in productImages:
                pi.save()

        return Response({
            'appliedCount': addedProductCount
        })
    
    def generate_product(self, name, maker):
        return Product(
            name= name,
            description="...",
            maker = maker,
            is_visible=True,
            price=decimal.Decimal(300),
            discount=0,
            stock_count=10,
            tags=""
        )
