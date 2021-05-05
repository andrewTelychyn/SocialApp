using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace SocialApp.BL.BusinessModels
{
    public class JwtOptions
    {
        public static string ISSUER = "SocialApp"; 

        public static string AUDIENCE = "client-app";

        private const string KEY = "KPIHelloBestPlace42";

        public static int LIFETIME = 3;

        public static SymmetricSecurityKey GetSymmetricSecurityKey()
        {
            return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(KEY));
        }
    }
}
