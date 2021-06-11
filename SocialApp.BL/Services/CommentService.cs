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
using System.Linq;

namespace SocialApp.BL.Services
{
    public class CommentService : ICommentService
    {
        IUnitOfWork database { get; set; }

        private  IMapper mapper; 

        public CommentService(IUnitOfWork uow)
        {
            database = uow;

            mapper = new MapperConfiguration(cfg => cfg.CreateMap<Comment, CommentDTO>()
            .ForMember(comment => comment.UserId, dto => dto.MapFrom(src => src.UserProfileId)))
            .CreateMapper();
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

                database.Posts.Update(post, item.PostId);

                await database.Commit();

                item.UserName = user.Name;
                item.Date = DateTime.Now;
                item.Id = id;

                System.Console.WriteLine(item.UserName);

                return new OperationDetails(true, "Successfully created", null, item);
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
                database.Posts.Update(post, post.Id);

                database.Comments.Delete(comment);

                await database.Commit();

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

                bool found = false;
                Like obj = new Like {Id =  new IdGenerator().Generate(), UserProfileId = userId, UserProfile = user};
                
                if(comment.Likes == null)
                    return new OperationDetails(false, "no likes");

                foreach(var item in comment.Likes)
                {
                    if(item.UserProfileId == userId)
                    {
                        found = true;
                        obj = item;
                        break;
                    }
                }

                if (found)
                {
                    comment.Likes.Remove(obj);
                    database.Comments.Update(comment, comment.Id);
                    await database.Commit();

                    return new OperationDetails(true, "Successfully removed like");
                }

                comment.Likes.Add(obj);
                database.Comments.Update(comment, comment.Id);
                await database.Commit();

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

                var list = new List<CommentDTO>();
                var comments = post.Comments.ToList();

                list.AddRange(mapper.Map<ICollection<Comment>, List<CommentDTO>>(post.Comments));

                for (int i = 0; i < list.Count; i++)
                {
                    list[i].UserName = database.UserProfiles.GetItemAsync(list[i].UserId).Result.Name;
                    list[i].LikesUserIds = comments[i].Likes.Select(like => like.UserProfileId).ToList();
                }

                return new OperationDetails(true, "Success", null, list.OrderBy(d => d.Date));
            }
            catch (Exception e)
            {
                return new OperationDetails(false, e.Message);
            }
        }

        public async Task<OperationDetails> DeleteComment(string Id)
        {
            try
            {
                var comment = await database.Comments.GetItemAsync(Id);
                if(comment == null)
                    return new OperationDetails(false, "Object doesn't exists");


                database.Comments.Delete(comment);

                await database.Commit();

                return new OperationDetails(true, "Successfully deleted");
            }
            catch (Exception e)
            {
                return new OperationDetails(false, e.Message);
            }
        }
    }
}
