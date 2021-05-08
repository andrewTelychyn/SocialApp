using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SocialApp.BL.Interfaces;
using SocialApp.BL.BusinessModels;
using SocialApp.BL.DTO;

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
            System.Console.WriteLine("trying to get");
            var result = await service.GetUser(userDTO.Id);

            if (!result.Succedeed)
            {
                System.Console.WriteLine(result.Message);
                return BadRequest(result.Message);
            }

            System.Console.WriteLine("Getting user success");
            return new OkObjectResult(result.Object);
        }

        // POST api/user/update
        [HttpPost]
        [Route("update")]
        public IActionResult Update(UserDTO userDTO)
        {
            System.Console.WriteLine("hello");
            var result = service.UpdateProfile(userDTO);

            if (!result.Succedeed)
            {
                System.Console.WriteLine(result.Message);
                return BadRequest(result.Message);
            }

            System.Console.WriteLine("Updating user success");
            return Ok();
        }

        // GET: api/<UserController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }


        // POST api/<UserController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
