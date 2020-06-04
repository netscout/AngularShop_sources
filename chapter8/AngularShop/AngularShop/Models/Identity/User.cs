using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace AngularShop.Models.Identity
{
    public class User : IdentityUser<long>
    {
        [StringLength(256)]
        public string PhotoUrl { get; set; }
    }
}
