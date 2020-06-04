using Microsoft.AspNetCore.Builder;

namespace AngularShop.Middlewares.Identity
{
    public static class JwtMiddlewareExtension
    {
        public static IApplicationBuilder UseSecureJwt(
            this IApplicationBuilder builder)
            => builder.UseMiddleware<SecureJwtMiddleware>();
    }
}
