from django.conf import settings
from shop.models import User

# https://stackoverflow.com/questions/6560182/django-authentication-without-a-password]
class AuthBackendWithouPassword:
    """
    패스워드 없이 사용자 이름만으로 로그인 처리
    """

    def authenticate(self, request, email=None):
        try:
            user = User.objects.get(email=email)
            return user
        except User.DoesNotExist:
            return None

        return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None