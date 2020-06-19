from rest_framework import serializers
from shop.models import Maker, Product, Category, ProductCategory,\
    ProductImage

#Maker모델을 json등의 형태로 직렬화 / 역직렬화
class MakerSerializer(serializers.ModelSerializer):
    class Meta:
        model=Maker
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    #null값을 유효한 값으로 처리하기 위해 allow_null설정
    parent_id = serializers.IntegerField(
        write_only=True,
        allow_null=True)
    #분류에 속한 제품 개수를 읽기전용으로 조회
    #이 속성은 view의 query_set에 정의
    total_products = serializers.IntegerField(read_only=True)

    class Meta:
        model=Category
        fields = ['id', 'name', 'total_products', 'parent_id']

#전체 분류 트리 조회를 위한 시리얼라이저
class RecursiveCategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    def get_children(self, obj):
        if obj.children is not None:
            #부모가 없는 루트 노드에 대해
            #모든 자식 노드를 제귀적으로 처리
            return [
                    RecursiveCategorySerializer(c).data 
                    for c in obj.children.all()
                ]
        else:
            return None

    class Meta:
        model=Category
        fields = ['id', 'name', 'parent_id', 'children']

#Product모델을 json등의 형태로 직렬화 / 역직렬화 
class ProductSerializer(serializers.ModelSerializer):
    #새로 추가되는 경우 id가 없을 수 있음
    id = serializers.IntegerField(
        required=False
    )

    #새 제품 등록시 제조 회사 번호를 통해 등록하려면
    #ForeignKey로 설정된 필드의 경우 별도로 id필드가 있어야 함
    maker_id = serializers.IntegerField()

    #categories 속성에 대해 별도의 메서드로 정의
    categories = serializers.SerializerMethodField()

    #photo_urls 속성에 대해 별도의 메서드로 정의
    photo_urls = serializers.SerializerMethodField()

    #DB와 매핑되지 않는 필드이므로 읽기 전용으로 설정
    maker_name = serializers.SerializerMethodField(read_only=True)

    #DB와 매핑되지 않는 필드이므로 읽기 전용으로 설정
    category_ids = serializers.ListField(
        child = serializers.IntegerField(),
        write_only=True)

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
            'created_date', 'modified_date', 'maker_id',
            'categories', 'photo_urls', 'maker_name', 'category_ids']
