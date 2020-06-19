from django.conf import settings

class SecureJwtResponseMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        response = self.get_response(request)

        #요청 처리 후 response를 받아서
        #token요청에 대한 response인 경우
        if (request.path_info.endswith("/Token") or\
            request.path_info.endswith("/SocialLogin")) and \
            request.method == 'POST' and \
            hasattr(response, 'data'):
            
            #Simple JWT의 토큰 응답인 경우
            if 'access' in response.data:
                #토큰을 쿠키로 저장
                response.set_cookie(
                    key='drf_backend',
                    value=response.data['access'],
                    max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"]\
                        .total_seconds(),
                    httponly=True
                )
                
                #토큰을 response에서 삭제
                response.data.pop('access')
                response.data.pop('refresh')
                response.content = response.render().rendered_content

        return response