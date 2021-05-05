using System;
using System.Collections.Generic;
using System.Text;
using SocialApp.BL.BusinessModels;
using SocialApp.BL.DTO;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SocialApp.BL.Interfaces
{
    public interface IApplicationUserService
    {
        Task<OperationDetails> Create(UserDTO item);

        OperationDetails Authenticate(UserDTO item);
    }
}
