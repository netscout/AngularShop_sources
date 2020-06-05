using AngularShop.Models.DTO;
using AngularShop.Models.Identity;
using System.Threading.Tasks;

namespace AngularShop.Services.Interfaces
{
    public interface IAccountService
    {
        Task<User> Register(UserRegistrationDTO req);
        Task<User> Register(SocialLoginDTO req, string provider = null);
    }
}
