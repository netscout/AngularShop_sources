from django.contrib import admin
from django.urls import path
from django.conf.urls import include

urlpatterns = [
    path('admin/', admin.site.urls),
    #127.0.0.1:8000/api/로 시작하는 모든 요청은
    #shop앱의 urls.py에서 처리하도록 함
    path('api/', include('shop.urls'))
]
