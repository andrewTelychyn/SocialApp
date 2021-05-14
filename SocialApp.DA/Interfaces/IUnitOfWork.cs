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

        IDetachRepository<UserProfile> UserProfiles { get; }

        IRepository<Comment> Comments { get; }

        IRepository<Post> Posts { get; }

        IRepository<Like> Likes {get;}

        void Commit();
    }
}
