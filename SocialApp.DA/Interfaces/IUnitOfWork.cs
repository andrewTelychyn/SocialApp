using Microsoft.AspNetCore.Identity;
using SocialApp.DA.Entities;
using SocialApp.DA.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace SocialApp.DA.Interfaces
{
    public interface IUnitOfWork
    {
        IStore<ApplicationRole> RoleStore { get; }

        IStore<ApplicationUser> UserStore { get; }

        IRepository<UserProfile> UserProfiles { get; }

        IRepository<Comment> Comments { get; }

        IRepository<Post> Posts { get; }

        void Commit();
    }
}
