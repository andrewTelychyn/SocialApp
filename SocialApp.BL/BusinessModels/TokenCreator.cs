using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace SocialApp.BL.BusinessModels
{
    public class TokenCreator
    {
        public static string Create() //IEnumerable<Claim> claims
        {
            var now = DateTime.UtcNow;

            var jwt = new JwtSecurityToken
                (issuer: JwtOptions.ISSUER,
                audience: JwtOptions.AUDIENCE,
                notBefore: now,
                //claims: claims,
                expires: now.Add(TimeSpan.FromMinutes(JwtOptions.LIFETIME)),
                signingCredentials: new SigningCredentials(
                    JwtOptions.GetSymmetricSecurityKey(),
                    SecurityAlgorithms.HmacSha256));

            return new JwtSecurityTokenHandler().WriteToken(jwt);
        }
    }
}
