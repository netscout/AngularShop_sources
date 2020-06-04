using AngularShop.Data;
using AngularShop.Models.DTO;
using AngularShop.Models.Identity;
using AngularShop.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace AngularShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly IAccountService _accountService;

        public AccountController(
            ApplicationDbContext context,
            UserManager<User> userManager,
            IAccountService accountService)
        {
            _context = context;
            _userManager = userManager;
            _accountService = accountService;
        }

        [HttpPost]
        public async Task<ActionResult> Register(
            [FromBody] UserRegistrationDTO req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(req);
            }

            //이메일로 회원 가입 여부 확인
            if (await _userManager.FindByEmailAsync(req.Email) != null)
            {
                return BadRequest("The email is already in use.");
            }

            User user;
            try
            {
                user = await _accountService.Register(req);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return Ok(new
            {
                Email = user.Email,
                Name = user.UserName
            });
        }

        [HttpPost]
        [Route("IsDupeField")]
        public bool IsDupeField(
            int id,
            string fieldName,
            string fieldValue)
        {
            return ApiResult<User>.IsDupeField(
                _context.Users,
                id,
                fieldName,
                fieldValue);
        }
    }
}
