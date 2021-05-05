using System;
using System.Collections.Generic;
using System.Text;
using SocialApp.BL.BusinessModels;
using SocialApp.BL.DTO;
using SocialApp.BL.Interfaces;
using SocialApp.DA.Interfaces;
using AutoMapper;
using SocialApp.DA.Entities;
using System.Threading.Tasks;

namespace SocialApp.BL.Services
{
    public class UserProfileService : IUserProfileService
    {
        IUnitOfWork database { get; set; }

        public UserProfileService(IUnitOfWork uow)
        {
            database = uow;
        }

        public async Task<OperationDetails> GetSubscribers(string Id)
        {
            try
            {
                var user = await database.UserProfiles.GetItemAsync(Id);

                if (user == null || user.Subscribers.Count == 0)
                    return new OperationDetails(false, "User doesn't exists or eh doesn't have subscribers");

                var list = new List<UserDTO>();
                var mapper = new MapperConfiguration(cfg => cfg.CreateMap<UserProfile, UserDTO>()).CreateMapper();

                //foreach (var userId in user.Subscribers)
                list.AddRange(mapper.Map<ICollection<UserProfile>, List<UserDTO>>(user.Subscribers));

                return new OperationDetails(true, "Success", null, list);
            }
            catch (Exception e)
            {
                return new OperationDetails(false, e.Message);
            }
        }

        public async Task<OperationDetails> GetUser(string Id)
        {
            try
            {
                var user = await database.UserProfiles.GetItemAsync(Id);

                if (user == null)
                    return new OperationDetails(false, "User doesn't exists");

                var mapper = new MapperConfiguration(cfg => cfg.CreateMap<UserProfile, UserDTO>()).CreateMapper();

                return new OperationDetails(true, "Success", null, mapper.Map<UserProfile, UserDTO>(user));
            }
            catch (Exception e)
            {
                return new OperationDetails(false, e.Message);
            }
        }

        public async Task<OperationDetails> Subscribe(string Id, string whomId)
        {
            try
            {
                var user = await database.UserProfiles.GetItemAsync(Id);
                var whomUser = await database.UserProfiles.GetItemAsync(whomId);

                if (user == null || whomUser == null)
                    return new OperationDetails(false, "User doesn't exists");

                if (user.Subscriptions.Contains(whomUser))
                {
                    user.Subscriptions.Remove(whomUser);
                    whomUser.Subscribers.Remove(user);

                    database.UserProfiles.Update(whomUser);
                    database.UserProfiles.Update(user);
                    database.Commit();

                    return new OperationDetails(true, "Successfully unsubscribed");
                }

                user.Subscriptions.Add(whomUser);
                whomUser.Subscribers.Add(user);

                database.UserProfiles.Update(whomUser);
                database.UserProfiles.Update(user);
                database.Commit();

                return new OperationDetails(true, "Successfully subscribed");
            }
            catch (Exception ex)
            {
                return new OperationDetails(false, ex.Message);
            }
        }
    }
}
