from datetime import datetime, timedelta

from django.conf import settings
from django.contrib.auth import authenticate
from django.http import HttpResponse
from rest_framework import generics, serializers, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions \
    import InvalidToken, TokenError
from rest_framework_simplejwt.serializers \
    import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from shop.identity.account_service import AccountService
from shop.models import User, UserLogin

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Simple JWT의 토큰 생성자 재정의
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        return token

    def validate(self, attrs):
        #validate에서 로그인이 이루어짐
        #로그인 후에 내부적으로 get_token을 호출하여 토큰 생성
        data = super(MyTokenObtainPairSerializer, self)\
            .validate(attrs)

        #로그인 성공시 리턴할 데이터 생성
        data['provider'] = "angularshop"
        data['name'] = self.user.username
        data['id'] = self.user.id
        data['email'] = self.user.email
        data['photoUrl'] = self.user.photo_url
        data['expires'] = datetime.now() + \
            settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"]
        data['roles'] = \
            self.user.groups.values_list('name', flat=True)

        return data

class MyTokenObtainPairView(TokenObtainPairView):
    """
    Simple JWT의 토큰 생성 뷰 재정의
    """
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(
            serializer.validated_data, 
            status=status.HTTP_200_OK)

    @action(detail=False)
    def check_social_login(self, request, *args, **kwargs):
        """
        소셜 로그인 등록 여부 확인
        """
        data = request.data
        
        return UserLogin.objects\
            .filter(login_Provider=data["provider"]) \
            .filter(provider_key=data["providerKey"]) \
            .exists() is not None

    #로그아웃 처리
    def delete(self, request, *args, **kwargs):
        #httponly 쿠키가 존재한다면 삭제 처리
        if 'drf_backend' in request.COOKIES:
            response = HttpResponse(status=status.HTTP_200_OK)
            response.delete_cookie('drf_backend')
            return response
        else:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)

class SocialTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Simple JWT의 토큰 생성자를 소셜 로그인에 맞게 재정의
    """
    expires = serializers.IntegerField(
        required=False
    )
    photoUrl = serializers.CharField()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        #기본 시리얼라이저에서 password필드 제거
        del self.fields['password']

    def validate(self, attrs):
        #AuthBackendWithouPassword를 통해 패스워드 없이 로그인 처리
        self.user = authenticate(
            self.context['request'], 
            email=attrs[self.username_field])

        #로그인시 토큰의 유효기간을 받은 경우 유효기간을 사용
        expires = None
        if "expires" in attrs and attrs["expires"] is not None:
            expires = timedelta(seconds=attrs["expires"])
        else:
            expires = settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"]

        #사용자 정보로 부터 토큰 생성
        refresh = self.get_token(self.user)

        data = {}

        #리턴 데이터에 토큰 추가
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        #로그인 성공시 리턴할 데이터 생성
        data['provider'] = "angularshop"
        data['name'] = self.user.username
        data['id'] = self.user.id
        data['email'] = self.user.email
        data['photoUrl'] = attrs['photoUrl']
        data['expires'] = datetime.now() + expires
        data['roles'] = \
            self.user.groups.values_list('name', flat=True)

        return data

class SocialTokenObtainPairView(TokenObtainPairView):
    """
    Simple JWT의 토큰 생성 뷰를 소셜 로그인에 맞게 재정의
    """
    serializer_class = SocialTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        """
        소셜로그인에 대해 등록된 사용자인지 확인 후
        미등록 사용자는 등록 처리 후 로그인
        등록 사용자는 바로 로그인 처리
        """
        data = request.data

        expires = None

        #소셜 로그인 등록 여부 확인
        user = User.objects\
            .filter(user_logins__login_provider=data["provider"]) \
            .filter(user_logins__provider_key=data["providerKey"]) \
            .first()

        #등록되지 않은 사용자라면
        if user is None:
            userdata = {
                "username": data["name"],
                "email": data["email"]
            }
            #회원 등록
            user = AccountService.register(userdata)

            #소셜 로그인 등록
            UserLogin.objects.create(
                login_provider = data["provider"],
                provider_key=data["providerKey"],
                user = user
            )
        elif "email" not in data or\
            len(data["email"]) == 0:
            #카카오 로그인의 경우 이메일이 필수가 아님
            data["email"] = user.email

        #로그인 처리 및 토큰 생성
        serializer = self.get_serializer(data=data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(
            serializer.validated_data, 
            status=status.HTTP_200_OK)