using AngularShop.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AngularShop.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _accessor;

        public TokenService(
            IConfiguration config,
            IHttpContextAccessor accessor)
        {
            _config = config;
            _accessor = accessor;
        }

        /// <summary>
        /// JWT 토큰을 생성하여 httponly 쿠키로 브라우저에 전송
        /// </summary>
        /// <param name="id">사용자 번호</param>
        /// <param name="email">이메일</param>
        /// <param name="name">이름</param>
        /// <param name="roleClaims">역할 목록</param>
        /// <param name="expires">만료 시간</param>
        /// <returns>JWT 토큰의 만료 시간</returns>
        public DateTime GenerateToken(
            long id,
            string email,
            string name,
            List<Claim> roleClaims,
            DateTime? expires = null)
        {
            //만료 시간이 따로 주어지지 않았다면, 기본 설정값만큼 더해 만료시간을 계산
            if (!expires.HasValue)
            {
                expires = DateTime.UtcNow.AddDays(
                    int.Parse(_config["Jwt:Expires"]));
            }

            //토큰에 필요한 기본 값들과 함께, 사용자 정보 추가
            var claims = new List<Claim>
                {
                    new Claim(
                        JwtRegisteredClaimNames.Sub, 
                        _config["Jwt:Subject"]),
                    new Claim(
                        JwtRegisteredClaimNames.Jti, 
                        Guid.NewGuid().ToString()),
                    new Claim(
                        JwtRegisteredClaimNames.Iat, 
                        DateTime.UtcNow.ToString()),
                    new Claim("Email", email),
                    new Claim("Name", name),
                    new Claim("Id", id.ToString())
                };

            //사용자의 역할도 같이 토큰에 포함
            claims.AddRange(roleClaims);

            //암호화 과정을 통해 토큰 생성
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var signIn = new SigningCredentials(
                key, 
                SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: expires.Value,
                signingCredentials: signIn);
            var jwtToken = new JwtSecurityTokenHandler().WriteToken(token);

            //생성된 JWT토큰을 쿠키에 저장하여 브라우저에 전송
            _accessor.HttpContext.Response.Cookies.Append(
                "AnCoreShop_backend",
                jwtToken,
                new CookieOptions { Expires = expires });

            return expires.Value;
        }
    }
}
