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
            System.Console.WriteLine("trying to create post");
            var result = await service.CreatePost(postDTO);

            if(!result.Succedeed)
            {
                System.Console.WriteLine(result.Message);
                return BadRequest(result.Message);
            }
            System.Console.WriteLine("post creating success");
            return new OkObjectResult(result.Object);
        }

        [HttpPost]
        [Route("get-user-posts")]
        public async Task<IActionResult> GetUserPosts(PostDTO postDTO)
        {
            var result = await service.GetUserPosts(postDTO.UserId);

            if(!result.Succedeed)
            {
                System.Console.WriteLine("getting posts failed");
                System.Console.WriteLine(result.Message);
                return BadRequest(result.Message);
            }

            System.Console.WriteLine("getting posts success");
            return new OkObjectResult(result.Object);
        }
        
        [HttpPost]
        [Route("smash-that-like-button")]
        public async Task<IActionResult> SmashLike(PostDTO postDTO)
        {
            var result = await service.LikePost(postDTO.UserId, postDTO.Id);

            if(!result.Succedeed)
            {
                System.Console.WriteLine("liking posts failed");
                System.Console.WriteLine(result.Message);
                return BadRequest(result.Message);
            }

            System.Console.WriteLine(result.Message);
            return new OkObjectResult(new {Message = result.Message});
        }

        [HttpPost]
        [Route("get-one-post")]
        public async Task<IActionResult> GetOnePost(PostDTO postDTO)
        {
            var result = await service.GetOnePost(postDTO.Id);

            if(!result.Succedeed)
            {
                System.Console.WriteLine(result.Message);
                return BadRequest(result.Message);
            }

            return new OkObjectResult(result.Object);
        }

        [HttpPost]
        [Route("get-uploads-posts")]
        public async Task<IActionResult> GetUploadsPosts(UserDTO userDTO)
        {
            var result = await service.GetSubscriptionPosts(userDTO);

            if(!result.Succedeed)
            {
                System.Console.WriteLine(result.Message);
                return BadRequest(result.Message);
            }

            System.Console.WriteLine(result.Message);
            return new OkObjectResult(result.Object);
        }

        [HttpGet]
        [Route("get-trending-posts")]
        public IActionResult GetTrendingPosts()
        {
            var result = service.GetTrending();

            if(!result.Succedeed)
            {
                System.Console.WriteLine(result.Message);
                return BadRequest(result.Message);
            }

            System.Console.WriteLine(result.Message);
            return new OkObjectResult(result.Object);
        }

        [HttpPost]
        [Route("delete-post")]
        public async Task<IActionResult> DeletePost(PostDTO postDTO)
        {
            var result = await service.DeletePost(postDTO.Id);

            if(!result.Succedeed)
            {
                System.Console.WriteLine(result.Message);
                return BadRequest(result.Message);
            }

            System.Console.WriteLine(result.Message);
            return new OkObjectResult(new {Message = result.Message});
        }
    }
}
