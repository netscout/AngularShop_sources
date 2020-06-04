using AngularShop.Data;
using AngularShop.Models.DTO;
using AngularShop.Models.Identity;
using AngularShop.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AngularShop.Services
{
    public class AccountService : IAccountService
    {
        private readonly UserManager<User> _userManager;
        private readonly ApplicationDbContext _context;

        public AccountService(
            UserManager<User> userManager,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        /// <summary>
        /// 새 사용자 등록
        /// </summary>
        /// <param name="req">사용자 등록 정보</param>
        /// <returns>등록된 사용자 정보</returns>
        public async Task<User> Register(UserRegistrationDTO req)
        {
            var user = new User
            {
                Email = req.Email
            };

            //이메일에서 자동으로 사용자 이름 생성
            user.UserName = user.Email.Split("@")[0];
            //사용자 이름 중복시 랜덤한 숫자를 붙임
            if (await _userManager.FindByNameAsync(user.UserName) != null)
            {
                Random rand = new Random();
                int randNum = rand.Next(0, 999999);
                user.UserName = $"{user.UserName}{randNum}";
            }
            user.SecurityStamp = Guid.NewGuid().ToString();
            //기본 사용자 프로필 사진
            user.PhotoUrl = $"images/profiles/default_profile.png";
            user.EmailConfirmed = false;

            return await Register(user, password: req.Password);
        }

        /// <summary>
        /// 소셜 로그인으로 사용자 등록
        /// </summary>
        /// <param name="req">사용자 등록 정보</param>
        /// <param name="provider">소셜 로그인 제공자</param>
        /// <returns>등록된 사용자 정보</returns>
        public async Task<User> Register(
            SocialLoginDTO req, 
            string provider = null)
        {
            var user = new User
            {
                Email = req.Email,
            };
            user.UserName = req.Name;
            user.SecurityStamp = Guid.NewGuid().ToString();
            user.EmailConfirmed = true;

            return await Register(
                user, 
                provider: provider, 
                providerKey: req.ProviderKey);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <param name="password"></param>
        /// <param name="provider"></param>
        /// <param name="providerKey"></param>
        /// <returns></returns>
        private async Task<User> Register(
            User user,
            string password = null,
            string provider = null,
            string providerKey = null)
        {
            IdentityResult result = null;
            
            if (password != null)
            {
                result = await _userManager.CreateAsync(user, password);
            }
            //소셜 로그인의 경우 패스워드는 직접 저장하지 않음
            else
            {
                result = await _userManager.CreateAsync(user);
            }

            if (!result.Succeeded)
            {
                throw new Exception("회원 등록중 오류 발생.");
            }

            //기본으로 사용자 역할 추가
            result = await _userManager.AddToRolesAsync(
                user,
                new List<string> {
                    Constants.DefaultUserRole
                });

            //소셜 로그인의 경우
            if (provider != null)
            {
                //사용자와 소셜 로그인을 연결
                var info = new UserLoginInfo(
                    provider, 
                    providerKey, 
                    provider.ToUpperInvariant());
                    
                result = await _userManager.AddLoginAsync(user, info);
                if (!result.Succeeded)
                {
                    throw new Exception("소셜 로그인과 연동 중 오류 발생.");
                }
            }

            await _context.SaveChangesAsync();

            return user;
        }
    }
}
