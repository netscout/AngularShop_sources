using Microsoft.AspNetCore.Identity;

namespace AngularShop.Models.Identity
{
    public class Role : IdentityRole<long>
    {
        public Role()
        {

        }

        public Role(string roleName)
            : base(roleName)
        {

        }
    }
}
