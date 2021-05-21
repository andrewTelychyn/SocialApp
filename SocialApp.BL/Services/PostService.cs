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
                    ForMember(dto => dto.UserId, conf => conf.MapFrom(src => src.UserProfileId)))
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
                database.UserProfiles.Update(user, user.Id);
                await database.Posts.CreateAsync(post);
                await database.Commit();

                item.UserName = user.Name;
                item.Date = DateTime.Now;
                item.Id = id;

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
                var post = await database.Posts.GetItemAsync(Id);
                if(post == null)
                    return new OperationDetails(false, "Object doesn't exists");


                database.Posts.Delete(post);

                await database.Commit();

                return new OperationDetails(true, "Successfully deleted");
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
                var result = await GetUserPosts(item.Id);
                if(!result.Succedeed)  return result;

                var list = new List<PostDTO>((List<PostDTO>)result.Object);

                if (item.SubscriptionsUserIds == null || item.SubscriptionsUserIds.Count == 0)
                    return new OperationDetails(true, "There is no subscriptions - only user posts", null, list); 


                foreach (var userId in item.SubscriptionsUserIds)
                {
                    var smallerList = new List<PostDTO>();

                    var posts = (await database.UserProfiles.GetItemAsync(userId)).Posts.ToList();
                    smallerList.AddRange(mapper.Map<ICollection<Post>, List<PostDTO>>(posts));

                    for(int i = 0; i < smallerList.Count; i++)
                    {
                        smallerList[i].UserName = database.UserProfiles.GetItemAsync(smallerList[i].UserId).Result.Name;
                        smallerList[i].LikesUserIds = posts[i].Likes.Select(like => like.UserProfileId).ToList();
                        smallerList[i].CommentsIds = posts[i].Comments.Select(comment => comment.UserProfileId).ToList();
                    }

                    list.AddRange(smallerList);
                }

                return new OperationDetails(true, "Success", null, list.OrderBy(d => d.Date).Reverse());
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
                var posts = user.Posts.ToList();

                list.AddRange(mapper.Map<ICollection<Post>, ICollection<PostDTO>>(user.Posts));

                for (int i = 0; i < list.Count; i++)
                {
                    list[i].UserName = database.UserProfiles.GetItemAsync(list[i].UserId).Result.Name;
                    list[i].LikesUserIds = posts[i].Likes.Select(like => like.UserProfileId).ToList();
                    list[i].CommentsIds = posts[i].Comments.Select(comment => comment.UserProfileId).ToList();
                }
                
                return new OperationDetails(true, "Success", null, list.OrderBy(d => d.Date).Reverse().ToList());
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
                    database.Posts.Update(post, post.Id);
                    await database.Commit();

                    return new OperationDetails(true, "Successfully removed like");
                }

                post.Likes.Add(obj);
                database.Posts.Update(post, post.Id);
                await database.Commit();

                return new OperationDetails(true, "Successfully added like");
            }
            catch (Exception e)
            {
                return new OperationDetails(false, e.Message);
            }
        }

        public async Task<OperationDetails> GetOnePost(string Id)
        {
            try
            {
                var post = await database.Posts.GetItemAsync(Id);
                var postDTO = mapper.Map<Post, PostDTO>(post);

                if (postDTO == null)
                    return new OperationDetails(false, "Post doesn't exists");
                
                postDTO.UserName = database.UserProfiles.GetItemAsync(postDTO.UserId).Result.Name;
                postDTO.LikesUserIds = post.Likes.Select(like => like.UserProfileId).ToList();
                postDTO.CommentsIds = post.Comments.Select(comment => comment.UserProfileId).ToList();


                return new OperationDetails(true, "Success", null, postDTO);
            }
            catch (Exception e)
            {
                return new OperationDetails(false, e.Message);
            }
        }

        public OperationDetails GetTrending()
        {
            try
            {
                var posts = database.Posts.GetAllAsync().ToList();

                if(posts == null || posts.Count() == 0)
                    return new OperationDetails(false, "There is no posts");

                var list = new List<PostDTO>();
                list.AddRange(mapper.Map<List<Post>, ICollection<PostDTO>>(posts));

                for(int i = 0; i < list.Count; i++)
                {
                    list[i].UserName = database.UserProfiles.GetItemAsync(list[i].UserId).Result.Name;
                    list[i].LikesUserIds = posts[i].Likes.Select(like => like.UserProfileId).ToList();
                    list[i].CommentsIds = posts[i].Comments.Select(comment => comment.UserProfileId).ToList();
                }

                var now = DateTime.Now.AddDays(-7);
                list = list.Where(p => p.Date.CompareTo(now) > 0).ToList();

                return new OperationDetails(true, "Success", null, list.OrderBy(p => p.LikesUserIds.Count).ThenBy(p => p.CommentsIds.Count).Reverse());
            }
            catch (System.Exception e)
            {
                return new OperationDetails(false, e.Message);
            }
        }
    }
}
