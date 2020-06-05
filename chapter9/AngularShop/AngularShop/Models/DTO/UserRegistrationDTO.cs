using System.ComponentModel.DataAnnotations;

namespace AngularShop.Models.DTO
{
    public class UserRegistrationDTO : LoginDTO
    {
        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "입력된 값이 패스워드와 같아야 합니다.")]
        public string ConfirmPassword { get; set; }
    }
}
