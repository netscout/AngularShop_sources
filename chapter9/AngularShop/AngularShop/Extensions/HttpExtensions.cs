using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace AngularShop.Extensions
{
    public static class HttpExtensions
    {
        public static long CurrentUserId(this HttpRequest request)
        {
            long id = 0;

            var identity = 
                request.HttpContext.User.Identity 
                    as ClaimsIdentity;
            if (identity != null)
            {
                //로그인 정보에서 id값을 추출
                if (!long.TryParse(identity.FindFirst("Id")?.Value, out id))
                {
                    //추출 실패시 0
                    return 0;
                }
            }

            return id;
        }
    }
}
