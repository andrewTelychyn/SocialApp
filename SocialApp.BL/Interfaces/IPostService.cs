using System;
using System.Collections.Generic;
using System.Text;
using SocialApp.BL.DTO;
using SocialApp.BL.BusinessModels;
using System.Threading.Tasks;

namespace SocialApp.BL.Interfaces
{
    public interface IPostService
    {
        Task<OperationDetails> CreatePost(PostDTO item);

        Task<OperationDetails> DeletePost(string Id);

        Task<OperationDetails> GetUserPosts(string Id);

        Task<OperationDetails> GetSubscriptionPosts(UserDTO item);

        Task<OperationDetails> LikePost(string userId, string postId);

    }
}
