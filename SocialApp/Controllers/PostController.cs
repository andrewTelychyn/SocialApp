using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SocialApp.BL.Interfaces;
using SocialApp.BL.BusinessModels;
using SocialApp.BL.DTO;

namespace SocialApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostController : ControllerBase
    {
         private readonly IPostService service;

        public PostController(IPostService service)
        {
            this.service = service;
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> Create(PostDTO postDTO)
        {
            var result = await service.CreatePost(postDTO);

            if(!result.Succedeed)
            {
                return BadRequest(result.Message);
            }
            System.Console.WriteLine("post creating success");
            return Ok();
        }
    }
}
