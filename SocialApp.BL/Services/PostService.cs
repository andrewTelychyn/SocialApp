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
        private IMapper mapper;

        public PostService(IUnitOfWork uow)
        {
            database = uow;

            mapper = new MapperConfiguration(cfg => cfg.CreateMap<Post, PostDTO>().
                    ForMember(post => post.UserId, dto => dto.MapFrom(src => src.UserProfileId)))
                    //ForMember(post => post.LikesUserIds, dto => dto.MapFrom(src => src.Likes.Select(item => item.UserProfileId)))).
                    .CreateMapper();
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

                item.UserName = user.Name;
                item.Date = DateTime.Now;

                return new OperationDetails(true, "Successfully created", null, item);
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
                //var mapper = new MapperConfiguration(cfg => cfg.CreateMap<Post, PostDTO>()).CreateMapper();

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
                

                list.AddRange(mapper.Map<ICollection<Post>, ICollection<PostDTO>>(user.Posts));

                for (int i = 0; i < list.Count; i++)
                {
                    list[i].UserName = database.UserProfiles.GetItemAsync(list[i].UserId).Result.Name;
                    list[i].LikesUserIds = user.Posts.ToList()[i].Likes.Select(like => like.UserProfileId).ToList();
                }

                // foreach(var post in list) {
                //     post.UserName = database.UserProfiles.GetItemAsync(post.UserId).Result.Name;
                //     post.LikesUserIds = user.Posts.Select(item => item.Likes.Select(like => like.UserProfileId).ToList()).ToList();
                // }
                return new OperationDetails(true, "Success", null, list.OrderBy(d => d.Date).Reverse());
            }
            catch (Exception e)
            {
                return new OperationDetails(false, e.Message);
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

                bool found = false;
                Like obj = new Like {Id =  new IdGenerator().Generate(), UserProfileId = userId, UserProfile = user};
                
                if(post.Likes == null)
                    return new OperationDetails(false, "no likes");

                foreach(var item in post.Likes)
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
                    post.Likes.Remove(obj);
                    database.Posts.Update(post);
                    database.Commit();

                    return new OperationDetails(true, "Successfully removed like");
                }

                post.Likes.Add(obj);
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
