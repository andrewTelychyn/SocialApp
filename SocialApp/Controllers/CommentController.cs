using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SocialApp.BL.Interfaces;
using SocialApp.BL.BusinessModels;
using SocialApp.BL.DTO;


namespace SocialApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly ICommentService service;

        public CommentController(ICommentService service)
        {
            this.service = service;
        }

        // GET: api/<CommentController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        [HttpPost]
        [Route("add-comment")]
        public async Task<IActionResult> Create(CommentDTO commentDTO)
        {
            System.Console.WriteLine("trying to create comment");
            var result = await service.CreateComment(commentDTO);

            if(!result.Succedeed)
            {
                System.Console.WriteLine(result.Message);
                return BadRequest(result.Message);
            }
            System.Console.WriteLine("comment creating success");
            return new OkObjectResult(result.Object);
        }

        [HttpPost]
        [Route("get-comments")]
        public async Task<IActionResult> GetComments(PostDTO postDTO)
        {
            var result = await service.ShowComments(postDTO.Id);

            if(!result.Succedeed)
            {
                System.Console.WriteLine(result.Message);
                return BadRequest(result.Message);
            }

            System.Console.WriteLine("getting comments success");
            return new OkObjectResult(result.Object);
        }

        [HttpPost]
        [Route("smash-that-like-button")]
        public async Task<IActionResult> SmashLike(CommentDTO commentDTO)
        {
            var result = await service.LikeComment(commentDTO.UserId, commentDTO.Id);

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
