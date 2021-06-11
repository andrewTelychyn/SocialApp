using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SocialApp.BL.Interfaces;
using SocialApp.BL.BusinessModels;
using SocialApp.BL.DTO;
using Microsoft.AspNetCore.Authorization;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SocialApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserProfileService service;

        public UserController(IUserProfileService service)
        {
            this.service = service;
        }

        // POST api/user/get-profile
        [HttpPost]
        [Route("getprofile")]
        public async Task<IActionResult> GetProfile(UserDTO userDTO)
        {
            System.Console.WriteLine($"trying to get: {userDTO.Id}");
            var result = await service.GetUser(userDTO.Id);

            if (!result.Succedeed)
            {
                System.Console.WriteLine($"Getting user nope: {result.Message}");
                return BadRequest(result.Message);
            }

            System.Console.WriteLine($"Getting user success: {userDTO.Id}");
            return new OkObjectResult(result.Object);
        }

        // POST api/user/update
        [Authorize]
        [HttpPost]
        [Route("update")]
        public async Task<IActionResult> Update(UserDTO userDTO)
        {
            var result = await service.UpdateProfile(userDTO);

            if (!result.Succedeed)
            {
                System.Console.WriteLine(result.Message);
                return BadRequest(result.Message);
            }

            System.Console.WriteLine("Updating user success");
            return new OkObjectResult(new {Message = "Updating user success"});
        }

        [Authorize]
        [HttpPost]
        [Route("subscribe")]
        public async Task<IActionResult> Subscribe(PostDTO postDTO)
        {
            var result = await service.Subscribe(postDTO.Id, postDTO.UserId);

            if (!result.Succedeed)
            {
                System.Console.WriteLine($"Subscribing failed: {result.Message}");
                return BadRequest(result.Message);
            }

            System.Console.WriteLine("Subscribing success");
            return new OkObjectResult(new {Message = "Subscribing success"});
        }

    }
}
