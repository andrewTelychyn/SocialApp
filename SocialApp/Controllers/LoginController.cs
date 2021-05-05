using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SocialApp.BL.Interfaces;
using SocialApp.BL.DTO;
using SocialApp.BL.BusinessModels;
using System.IO;


namespace SocialApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IApplicationUserService service;

        public LoginController(IApplicationUserService service)
        {
            this.service = service;
        }

        // POST api/login/register
        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register(UserDTO userBody)
        {
            Console.WriteLine("trying");

            var result = await service.Create(userBody);

            if (result.Succedeed)
                return new OkObjectResult(result.Object);

            Console.WriteLine($"result {result.Message}");

            return BadRequest(result.Message);
        }

        // POST api/login
        [HttpPost]
        [Route("")]
        public IActionResult Login(UserDTO user)
        {
            var result = service.Authenticate(user);

            if (!result.Succedeed)
                return BadRequest(result.Message);

            return new OkObjectResult(result.Object);
        }
    }
}
