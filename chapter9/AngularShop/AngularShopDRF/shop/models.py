from django.db import models
from django.contrib.auth.models import AbstractUser

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

# class Profile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     photo_url = models.CharField(max_length=512)

#     class Meta:
#         ordering = ['id']
#         db_table = "UserProfiles"

class User(AbstractUser):
    #로그인에 사용하려면 반드시 중복 없이 unique해야 함
    email = models.CharField(
        max_length=255, 
        unique=True)
    #프로필 사진
    photo_url = models.CharField(
        max_length=255
    )

    #로그인에 이름 대신에 이메일 사용
    USERNAME_FIELD = 'email'

    #이름은 필수 입력 필드
    REQUIRED_FIELDS = ['username']

    class Meta:
        db_table = "Users"

class UserLogin(models.Model):
    #로그인 제공자(구글, 카카오)
    login_provider = models.CharField(
        max_length=255,
        null=False,
        db_column="loginProvider"
    )
    #로그인 제공자의 회원키
    provider_key = models.CharField(
        max_length=255,
        null=False,
        db_column="providerKey"
    )
    user = models.ForeignKey(
        User, 
        related_name='user_logins', 
        on_delete=models.CASCADE,
        db_column="userId")

    class Meta:
        db_table = "UserLogins"

class OrderStatusId(models.IntegerChoices):
        Pending = 0
        Payment_Accepted = 1
        Processing_In_Progress = 2
        On_Shipping = 3
        Delivered = 4
        Delivery_Confirmed = 5
        Canceled = 6

class Order(models.Model):
    to_name = models.TextField(
        max_length=256, 
        null=False,
        db_column="toName")
    address1 = models.TextField(max_length=512, null=False)
    address2 = models.TextField(max_length=512, null=False)
    phone = models.TextField(max_length=20, null=False)
    total_price = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        db_column="totalPrice"
    )
    created_date = models.DateTimeField(
        auto_now_add=True,
        db_column="createdDate")
    modified_date = models.DateTimeField(
        auto_now_add=True,
        db_column="modifiedDate")

    user = models.ForeignKey(
        User, 
        related_name='orders', 
        on_delete=models.CASCADE,
        db_column="userId")
    order_status = models.IntegerField(
        choices=OrderStatusId.choices,
        db_column="orderStatusId")
    
    class Meta:
        ordering = ['id']
        db_table = "Orders"

class OrderItem(models.Model):
    qty = models.IntegerField(
        null=False
    )
    price = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        null=False
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="ordered_list",
        db_column="productId"
    )
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="order_items",
        db_column="orderId"
    )

    class Meta:
        ordering = ['id']
        db_table = "OrderItems"

class OrderStatus(models.Model):
    id = models.IntegerField(
        null=False,
        primary_key=True
    )
    name = models.TextField(
        null=False,
        max_length=256
    )

    class Meta:
        ordering = ['id']
        db_table = "OrderStatuses"
