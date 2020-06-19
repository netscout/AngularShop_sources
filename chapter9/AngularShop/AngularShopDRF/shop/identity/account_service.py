from shop.models import User
from random import random
from django.contrib.auth.models import Group

class AccountService:
    @classmethod
    def register(cls, data):
        #사용자 이름 중복시 이름에 랜덤하게 숫자를 붙이기
        if User.objects.filter(username=data["username"])\
            .exists():
            rand_num = random.randint(0, 999999)
            data["username"] = f"{data['username']}{rand_num}"
        #기본 프로필 사진
        data["photo_url"] = "images/profiles/default_profile.png"

        #사용자 데이터 생성 및 저장
        user = User.objects.create_user(
            **data
        )

        #사용자에 USER 그룹 추가
        role_user = Group.objects.filter(name="USER")\
            .first()
        user.groups.add(role_user)

        return user