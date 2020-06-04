using System;
using System.Collections.Generic;
using System.Security.Claims;

namespace AngularShop.Services.Interfaces
{
    public interface ITokenService
    {
        DateTime GenerateToken(
            long id, 
            string email, 
            string name, 
            List<Claim> roleClaims, 
            DateTime? expires = null);
    }
}
