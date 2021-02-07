import random

from django.contrib.auth.models import Group
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from shop.identity.account_service import AccountService
from shop.identity.permissions import PermissionsPerMethodMixin
from shop.models import User, UserLogin
from shop.serializers import UserSerializer

class UserViewSet(
    PermissionsPerMethodMixin,
    viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    #누구나 접근 가능
    @action(
        detail=False,
        permission_classes=[permissions.AllowAny])
    def create(self, request, *args, **kwargs):
        """
        사용자 등록
        """
        data = request.data

        #패스워드와 패스워드 확인 비교
        if data["password"] != \
            data["confirmPassword"]:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        #패스워드 확인 속성은 더 이상 필요 없으므로 삭제
        del data["confirmPassword"]

        #이메일에서 기본 사용자 이름 생성
        data["username"] = data["email"].split("@")[0]
        
        user = AccountService.register(data)

        return Response(
            {
                'email': user.email,
                'name': user.username
            },
            status=status.HTTP_201_CREATED
        )

    #누구나 접근 가능
    @action(
        detail=False,
        permission_classes=[permissions.AllowAny])
    def is_dupe_field(self, request, *args, **kwargs):
        """
        사용자 추가 / 수정시 중복 검사
        """
        id = request.query_params["id"]
        field_value = request.query_params["fieldValue"]
        c = User.objects\
            .filter(email=field_value)\
            .exclude(id=id)\
            .first()
        
        return Response(c is not None)

    @action(
        detail=False,
        permission_classes=[permissions.AllowAny])
    def check_social_login(self, request, *args, **kwargs):
        """
        소셜 로그인 등록 여부 확인
        """
        data = request.data
        
        exist = UserLogin.objects.filter(login_provider=data["provider"]) \
            .filter(provider_key=data["providerKey"]) \
            .exists()

        return Response(
            {
                'exist': exist
            }
        )

    #누구나 접근 가능
    @action(
        detail=False,
        permission_classes=[permissions.AllowAny])
    def generate_users(self, request):
        """
        기본 사용자 추가 및 그룹 설정
        """
        #ADMIN, USER 그룹을 생성하고
        role_admin = Group.objects.filter(name="ADMIN")\
            .first()
        if role_admin is None:
            role_admin = Group.objects.create(
                name="ADMIN"
            )
        role_user = Group.objects.filter(name="USER")\
            .first()
        if role_user is None:
            role_user = Group.objects.create(
                name="USER"
            )

        #python manage.py createsuperuser로 어드민 생성 필요
        #어드민 유저에 관리자 그룹 설정
        admin = User.objects.filter(email="admin@email.com")\
            .first()
        if admin is not None:
            if role_admin not in admin.groups.all():
                admin.groups.add(role_admin)
                admin.groups.add(role_user)
            if admin.photo_url is None \
                or len(admin.photo_url) == 0:
                admin.photo_url = \
                        "images/profiles/default_profile.png"
                admin.save()

        #일반 유저 계정 추가 및 유저 그룹 설정
        user = User.objects.filter(email="user@email.com")\
            .first()
        if user is None:
            user = User.objects.create_user(
                'user', 
                'user@email.com', 
                'qwerty1@',
                photo_url = "images/profiles/default_profile.png"
            )

        if user is not None:
            if role_user not in user.groups.all():
                user.groups.add(role_user)

        return Response(status=status.HTTP_200_OK)
