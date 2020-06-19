from django.urls import path
#from shop import views
from shop.views.product_view_set import ProductViewSet
from shop.views.category_view_set import CategoryViewSet

#ProductViewSet에서 제공하는 액션들 중에
#generate_products를 get요청에 매핑
product_seed = ProductViewSet.as_view({
    'get': 'generate_products'
})

#ProductViewSet에서 제공하는 액션들 중에
#기본 제공되는 list를 get요청에 매핑
product_list = ProductViewSet.as_view({
    'get': 'list'
})

category_list = CategoryViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
category_detail = CategoryViewSet.as_view({
    'get': 'retrieve',
    'put': 'update'
})
recursive_category_detail = CategoryViewSet.as_view({
    'get': 'get_entire_category_tree',
    'post': 'is_dupe_field'
})
#ViewSet의 경우 Router를 사용하면 좀 더 간편하게 설정할 수 있으나
#직관성이 떨어지므로 직접 매핑을 설정
urlpatterns = [
    path('seed/generate-products/', product_seed),
    path('Products/', product_list),
    path('Categories/', category_list),
    path('Categories/<int:pk>/', category_detail),
    path('Categories/EntireCategoryTree/', recursive_category_detail),
    path('Categories/IsDupeField/', recursive_category_detail),
]