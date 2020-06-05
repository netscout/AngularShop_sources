using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace AngularShop.Middlewares.Identity
{
    /// <summary>
    /// httponly 쿠키는 브라우저에서 확인할 수 없으므로 서버에서만 확인이 가능하다
    /// 서버에서 쿠키를 확인하여 쿠키가 존재한다면 헤더에 추가하여 다음에 전달
    /// </summary>
    public class SecureJwtMiddleware
    {
        private readonly RequestDelegate _next;

        public SecureJwtMiddleware(RequestDelegate next) => _next = next;

        public async Task InvokeAsync(HttpContext context)
        {
            //사용자의 요청이 API Controller에 도달하기 전에 요청을 중간에서 가로챔
            //사용자의 요청에서 JWT 토큰이 담긴 쿠키를 가져와서
            var token = context.Request.Cookies["AnCoreShop_backend"];

            //쿠키가 존재한다면
            if (!string.IsNullOrEmpty(token))
            {
                //JWT 토큰을 헤더에 추가하여 다음 처리기로 넘기기
                context.Request.Headers.Add(
                    "Authorization", 
                    "Bearer " + token);
            }


            context.Response.Headers.Add(
                "X-Content-Type-Options", "nosniff");
            context.Response.Headers.Add("X-Xss-Protection", "1");
            context.Response.Headers.Add("X-Frame-Options", "DENY");

            await _next(context);
        }
    }
}
