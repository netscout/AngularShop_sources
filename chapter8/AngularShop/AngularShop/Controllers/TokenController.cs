using AngularShop.Models.DTO;
using AngularShop.Models.Identity;
using AngularShop.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AngularShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly RoleManager<Role> _roleManager;
        private readonly UserManager<User> _userManager;
        private readonly ITokenService _tokenService;
        private readonly IAccountService _accountService;

        public TokenController(
            RoleManager<Role> roleManager,
            UserManager<User> userManager,
            ITokenService tokenService,
            IAccountService accountService)
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _tokenService = tokenService;
            _accountService = accountService;
        }

        // POST: api/Token
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginDTO req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(req);
            }

            //이메일과 패스워드로 사용자를 찾으면
            var user = await _userManager.FindByEmailAsync(req.Email);            
            if (user != null
                && await _userManager.CheckPasswordAsync(user, req.Password))
            {
                //사용자의 역할을 가져오고
                var roles = await _userManager.GetRolesAsync(user);
                var roleClaims = GetRoleClaims(roles);
                //JWT 토큰 생성 및 쿠키로 전송
                var expires = _tokenService.GenerateToken(
                    user.Id, 
                    user.Email, 
                    user.UserName, 
                    roleClaims);

                return Ok(new
                {
                    Provider = "ancoreshop",
                    Id = user.Id,
                    Email = user.Email,
                    Name = user.UserName,
                    Expires = expires,
                    Roles = roles,
                    PhotoUrl = user.PhotoUrl
                });
            }

            return BadRequest("User not found. Check your email and password again.");
        }

        [HttpPost]
        [Route("CheckSocialLogin")]
        public async Task<ActionResult> CheckSocialLogin(SocialLoginDTO req)
        {
            //유저 확인해서 없으면 추가
            var user = await _userManager.FindByLoginAsync(
                req.Provider, 
                req.ProviderKey);

            return Ok(new
            {
                Exist = user != null
            });
        }

        [HttpPost]
        [Route("SocialLogin")]
        public async Task<ActionResult> SocialLogin(SocialLoginDTO req)
        {
            DateTime? expires = null;
            if (req.Expires.HasValue)
            {
                expires = DateTime.UtcNow.AddSeconds(req.Expires.Value);
            }

            //유저 확인해서 없으면 추가
            var user = await _userManager.FindByLoginAsync(
                req.Provider, 
                req.ProviderKey);
            if (user == null)
            {
                try
                {
                    user = await _accountService.Register(
                        req,
                        provider: req.Provider);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            var roles = await _userManager.GetRolesAsync(user);
            var roleClaims = GetRoleClaims(roles);
            //토큰 생성
            var resultExpires = 
                _tokenService.GenerateToken(
                    user.Id, 
                    user.Email, 
                    user.UserName, 
                    roleClaims, 
                    expires);

            if(!expires.HasValue)
            {
                expires = resultExpires;
            }

            //토큰 리턴
            return Ok(new
            {
                Provider = req.Provider,
                Id = user.Id,
                Email = user.Email,
                Name = user.UserName,
                PhotoUrl = req.PhotoUrl,
                Roles = roles,
                Expires = expires
            });
        }

        [Authorize]
        [HttpDelete]
        public IActionResult Logout()
        {
            var token = HttpContext.Request.Cookies["AnCoreShop_backend"];

            //JWT 토큰이 담긴 쿠키가 존재한다면
            if (!string.IsNullOrEmpty(token))
            {
                //쿠키 삭제
                HttpContext.Response.Cookies.Delete("AnCoreShop_backend");
            }
            else
            {
                return BadRequest();
            }

            return Ok(new
            {
                Result = true
            });
        }

        private List<Claim> GetRoleClaims(IList<string> roles)
        {
            var roleClaims = roles
                    .Select(r => new Claim(ClaimTypes.Role, r))
                    .ToList();

            return roleClaims;
        }
    }
}
