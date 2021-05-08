using System;
using System.Collections.Generic;
using System.Text;
using SocialApp.BL.DTO;
using SocialApp.BL.BusinessModels;
using System.Threading.Tasks;

namespace SocialApp.BL.Interfaces
{
    public interface IUserProfileService
    {
        Task<OperationDetails> GetUser(string Id);

        Task<OperationDetails> Subscribe(string Id, string whomId);

        Task<OperationDetails> GetSubscribers(string Id);

        OperationDetails UpdateProfile(UserDTO userDTO);
    }
}
