using System.ComponentModel.DataAnnotations;

namespace AngularShop.Models.DTO
{
    public class LoginDTO
    {
        [Required(ErrorMessage = "이메일은 필수입니다.")]
        [EmailAddress]
        public string Email { get; set; }

        [Required(ErrorMessage = "패스워드는 필수입니다.")]
        [StringLength(20, MinimumLength = 8)]
        [RegularExpression(@"^(?=.*[a-zA-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$")]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
