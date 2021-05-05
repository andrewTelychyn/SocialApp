using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using SocialApp.BL.BusinessModels;
using SocialApp.BL.DTO;
using SocialApp.BL.Interfaces;
using SocialApp.DA.Interfaces;
using SocialApp.DA.Entities;
using AutoMapper;
using shortid;
using shortid.Configuration;

namespace SocialApp.BL.Services
{
    public class CommentService : ICommentService
    {
        IUnitOfWork database { get; set; }

        public CommentService(IUnitOfWork uow)
        {
            database = uow;
        }

        public async Task<OperationDetails> CreateComment(CommentDTO item)
        {
            try
            {
                string id = new IdGenerator().Generate();

                var comment = new Comment
                {
                    Id = id,
                    Content = item.Content,
                    UserProfileId = item.UserId,
                    PostId = item.PostId
                };

                var post = await database .Posts.GetItemAsync(item.PostId);
                if (post == null)
                    return new OperationDetails(false, "Wrong post ID", "PostId");

                var user = await database .UserProfiles.GetItemAsync(item.UserId);
                if (user == null)
                    return new OperationDetails(false, "Wrong user ID", "UserId");

                comment.Post = post;
                comment.UserProfile = user;

                await database.Comments.CreateAsync(comment);

                post.Comments.Add(comment);
                database.Posts.Update(post);

                database.Commit();

                return new OperationDetails(true, "Successfully created");
            }
            catch ( Exception e)
            {
                return new OperationDetails(false, e.Message);
            }
        }

        public async Task<OperationDetails> DeleteComment(string commentId, string userId)
        {
            try
            {
                var comment = await database.Comments.GetItemAsync(commentId);

                if (comment == null)
                    return new OperationDetails(false, "Comment doesn't exists");

                if (comment.UserProfileId != userId)
                    return new OperationDetails(false, "No rigths", "UserId");

                var post = await database.Posts.GetItemAsync(comment.PostId);
                if (post == null)
                    return new OperationDetails(false, "Wrong post ID", "PostId");

                post.Comments.Remove(comment);
                database.Posts.Update(post);

                database.Comments.Delete(comment);

                database.Commit();

                return new OperationDetails(true, "Successfully deleted");
            }
            catch (Exception e)
            {
                return new OperationDetails(false, e.Message);
            }
        }

        public async Task<OperationDetails> LikeComment(string userId, string commentId)
        {
            try
            {
                var comment = await database.Comments.GetItemAsync(commentId);
                var user = await database.UserProfiles.GetItemAsync(userId);

                if (comment == null || user == null)
                    return new OperationDetails(false, "Comment doesn't exists");

                if (comment.Likes.Contains(user))
                {
                    comment.Likes.Remove(user);
                    database.Comments.Update(comment);
                    database.Commit();
                    return new OperationDetails(true, "Successfully removed like");
                }

                comment.Likes.Add(user);
                database.Comments.Update(comment);
                database.Commit();

                return new OperationDetails(true, "Successfully added like");
            }
            catch (Exception e)
            {
                return new OperationDetails(false, e.Message);
            }
        }

        public async Task<OperationDetails> ShowComments(string postId)
        {
            try
            {
                var post = await database.Posts.GetItemAsync(postId);

                if (post == null || post.Comments.Count == 0)
                    return new OperationDetails(false, "There is no comments");

                var mapper = new MapperConfiguration(cfg => cfg.CreateMap<Comment, CommentDTO>()).CreateMapper();
                var list = new List<CommentDTO>();

                list.AddRange(mapper.Map<ICollection<Comment>, List<CommentDTO>>(post.Comments));

                return new OperationDetails(true, "Success", null, list);
            }
            catch (Exception e)
            {
                return new OperationDetails(false, e.Message);
            }
        }
    }
}
