from django.db import models

class Product(models.Model):
    name = models.CharField(
        max_length=256,
        blank=False,
        null=False)
    description = models.TextField(
        blank=False,
        null=False
    )
    tags = models.CharField(
        max_length=256,
        blank=False,
        null=False)
    price = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        blank=False,
        null=False
    )
    discount = models.IntegerField(
        blank=False,
        null=False
    )
    stock_count = models.IntegerField(
        blank=False,
        null=False,
        db_column="stockCount"
    )
    is_visible = models.BooleanField(
        db_column="isVisible",
        blank=False,
        null=False
    )
    maker = models.ForeignKey(
        'Maker',
        on_delete=models.CASCADE, 
        null=True,
        db_column="makerId")

    created_date = models.DateTimeField(
        auto_now_add=True,
        db_column="createdDate")
    modified_date = models.DateTimeField(
        auto_now_add=True,
        null=True,
        db_column="modifiedDate")
    
    class Meta:
        #기본 정렬 필드
        ordering = ['id']
        #DB에 생성될 테이블 명
        db_table = "Products"

class Maker(models.Model):
    name = models.CharField(max_length=256)

    class Meta:
        ordering = ['id']
        db_table = "Makers"

#제품 분류(스스로 부모-자식 관계를 가짐)
class Category(models.Model):
    name = models.CharField(max_length=256)
    #related_name 속성은 1:N 관계에서 N을 참조하기 위해 설정
    #부모 분류가 children속성으로 자기의 자식 분류 목록을 참조 
    parent = models.ForeignKey(
        'self',
        related_name='children',
        blank=True,#유효성 검사, False시 필수 입력
        null=True,#DB 컬럼의 null가능 여부
        db_column="parentId",
        on_delete=models.CASCADE)

    class Meta:
        ordering = ['id']
        db_table = "Categories"

#제품이 포함될 분류(제품은 여러 개의 분류에 포함될 수 있음)
class ProductCategory(models.Model):
    #Product의 categories속성으로 ProductCategory목록을 참조
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        db_column="productId",
        related_name="categories")

    #Category의 products속성으로 ProductCategory목록을 참조
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        db_column="categoryId",
        related_name="products")

    sort_order = models.IntegerField(
        db_column="sortOrder",
        blank=True,
        null=False,
        default=1
    )

    class Meta:
        ordering = ['id']
        db_table = "ProductCategories"

#제품 이미지
class ProductImage(models.Model):
    photo_url = models.CharField(
        max_length=512,
        blank=False,
        null=False,
        db_column="photoUrl"
    )

    #Product의 images속성으로 이미지 목록 참조
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        db_column="productId",
        related_name="images")
    
    class Meta:
        ordering = ['id']
        db_table = "ProductImages"
