using System;
using System.Collections.Generic;
using System.Text;
using SocialApp.BL.DTO;
using SocialApp.BL.BusinessModels;
using System.Threading.Tasks;


namespace SocialApp.BL.Interfaces
{
    public interface ICommentService
    {
        Task<OperationDetails> CreateComment(CommentDTO item);

        Task<OperationDetails> LikeComment(string userId, string commentId);

        Task<OperationDetails> DeleteComment(string commentId);

        Task<OperationDetails> ShowComments(string postId);
    }
}
