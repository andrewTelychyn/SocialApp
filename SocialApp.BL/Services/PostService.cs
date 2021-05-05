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
using System.Linq;

namespace SocialApp.BL.Services
{
    public class PostService : IPostService
    {
        IUnitOfWork database { get; set; }

        public PostService(IUnitOfWork uow)
        {
            database = uow;
        }


        public async Task<OperationDetails> CreatePost(PostDTO item)
        {
            try
            {
                string id = new IdGenerator().Generate();

                var post = new Post
                {
                    Id = id,
                    Content = item.Content,
                    UserProfileId = item.UserId,
                };

                var user = await database.UserProfiles.GetItemAsync(item.UserId);
                if (user == null)
                    return new OperationDetails(true, "Wrong user id");

                post.UserProfile = user;

                user.Posts.Add(post);
                database.UserProfiles.Update(user);
                await database.Posts.CreateAsync(post);
                database.Commit();

                return new OperationDetails(true, "Successfully created");
            }
            catch (Exception e)
            {
                return new OperationDetails(false, e.Message);
            }
        }

        public async Task<OperationDetails> DeletePost(string Id)
        {
            try
            {
                var post = await database .Posts.GetItemAsync(Id);

                if(post == null)
                    return new OperationDetails(false, "Object doesn't exists");


                database.Posts.Delete(post);
                database.Commit();

                return new OperationDetails(true, "Successfully created");
            }
            catch (Exception e)
            {
                return new OperationDetails(false, e.Message);
            }
        }

        public async Task<OperationDetails> GetSubscriptionPosts(UserDTO item)
        {
            try
            {
                if (item.SubscriptionsUserIds.Count == 0)
                    return new OperationDetails(false, "There is no subscriptions"); 

                var list = new List<PostDTO>();
                var mapper = new MapperConfiguration(cfg => cfg.CreateMap<Post, PostDTO>()).CreateMapper();

                foreach (var userId in item.SubscriptionsUserIds)
                {
                    list.AddRange(mapper.Map<ICollection<Post>, List<PostDTO>>((await database.UserProfiles.GetItemAsync(userId)).Posts));
                }

                return new OperationDetails(true, "Success", null, list.OrderBy(d => d.Date));
            }
            catch (Exception e)
            {
                return new OperationDetails(false, e.Message);
            }
        }

        public async Task<OperationDetails> GetUserPosts(string Id)
        {
            try
            {
                var user = await database .UserProfiles.GetItemAsync(Id);

                if (user == null || user.Posts.Count == 0)
                    return new OperationDetails(false, "There is no subscriptions");

                var list = new List<PostDTO>();
                var mapper = new MapperConfiguration(cfg => cfg.CreateMap<Post, PostDTO>()).CreateMapper();

                list.AddRange(mapper.Map<ICollection<Post>, List<PostDTO>>(user.Posts));

                return new OperationDetails(true, "Success", null, list.OrderBy(d => d.Date));
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<OperationDetails> LikePost(string userId, string postId)
        {
            try
            {
                var post = await database.Posts.GetItemAsync(postId);
                var user = await database.UserProfiles.GetItemAsync(userId);

                if (post == null || user == null)
                    return new OperationDetails(false, "Post doesn't exists");

                if (post.Likes.Contains(user))
                {
                    post.Likes.Remove(user);
                    database.Posts.Update(post);
                    database.Commit();
                    return new OperationDetails(true, "Successfully removed like");
                }

                post.Likes.Add(user);
                database.Posts.Update(post);
                database.Commit();

                return new OperationDetails(true, "Successfully added like");
            }
            catch (Exception e)
            {
                return new OperationDetails(false, e.Message);
            }
        }
    }
}
