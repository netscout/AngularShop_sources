from rest_framework_simplejwt.state import token_backend
from shop.models import User

class SecureJwtRequestMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        #http 요청에서 httponly 쿠키를 찾고
        if 'drf_backend' in request.COOKIES:
            #쿠키가 있다면 쿠키에서 JWT토큰을 가져오고
            token_cookie = request.COOKIES['drf_backend']

            #요청 헤더에 JWT토큰을 추가
            request.META['HTTP_AUTHORIZATION'] = f"Bearer {token_cookie}"
            
            #토큰에서 사용자 정보를 생성
            payload = token_backend.decode(token_cookie, verify=True)
            request.user = User.objects.filter(id=payload["user_id"]).first()

        #다음 미들웨어에 요청을 넘김
        response = self.get_response(request)

        return response