using System;
using System.Collections.Generic;
using System.Text;
using shortid;
using shortid.Configuration;

namespace SocialApp.BL.BusinessModels
{
    public class IdGenerator
    {
        private readonly GenerationOptions options;

        public IdGenerator()
        {
            options = new GenerationOptions
            {
                UseNumbers = true,
                UseSpecialCharacters = false,
                Length = 8
            };
        }

        public string Generate()
        {
            return ShortId.Generate(options);
        }
    }
}
