from rest_framework import serializers
from shop.models import Maker, Product, Category, ProductCategory,\
    ProductImage

#Maker모델을 json등의 형태로 직렬화 / 역직렬화
class MakerSerializer(serializers.ModelSerializer):
    class Meta:
        model=Maker
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model=Category
        fields = ['id', 'name', 'parent_id']

#Product모델을 json등의 형태로 직렬화 / 역직렬화 
class ProductSerializer(serializers.ModelSerializer):
    #새 제품 등록시 제조 회사 번호를 통해 등록하려면
    #ForeignKey로 설정된 필드의 경우 별도로 id필드가 있어야 함
    maker_id = serializers.IntegerField()    

    #categories 속성에 대해 별도의 메서드로 정의
    categories = serializers.SerializerMethodField()

    #photo_urls 속성에 대해 별도의 메서드로 정의
    photo_urls = serializers.SerializerMethodField()

    maker_name = serializers.SerializerMethodField()

    #categories 속성에 대한 정의 메서드
    def get_categories(self, obj):
        #제품 아이디로 ProductCategory 테이블에서 조회
        qset = ProductCategory.objects.filter(product_id=obj.id)
        
        #각 조회된 데이터에서 category 네비게이션 속성으로
        #CategorySerializer를 통해 Json생성
        return [CategorySerializer(c.category).data for c in qset]

    #photo_urls 속성에 대한 정의 메서드
    def get_photo_urls(self, obj):
        qset = ProductImage.objects.filter(product_id=obj.id)

        return [pi.photo_url for pi in qset]

    def get_maker_name(self, obj):
        return obj.maker.name

    class Meta:
        model = Product
        #직렬화 / 역직렬화시 사용할 필드 명
        #전체의 경우 그냥 '__all__'
        fields = ['id', 'name', 'description',
            'tags', 'price', 'discount', 'stock_count', 'is_visible',
            'createdDate', 'modifiedDate', 'maker_id',
            'categories', 'photo_urls', 'maker_name']

