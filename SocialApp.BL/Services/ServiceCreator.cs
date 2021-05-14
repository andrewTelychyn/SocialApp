using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using SocialApp.BL.Interfaces;
using SocialApp.DA.Interfaces;
using SocialApp.DA.Repositories;
using SocialApp.DA.EF;


namespace SocialApp.BL.Services
{
    public class ServiceCreator : IServiceCreator
    {
        private readonly IUnitOfWork unitofwork;

        public ServiceCreator(string connectingString)
        {
            unitofwork = new UnitOfWork(new ApplicationDbContext(connectingString));
        }


        public IApplicationUserService CreateApplicationUserService()
        {
            return new ApplicationUserService(unitofwork);
        }

        public ICommentService CreateCommentService()
        {
            return new CommentService(unitofwork);
        }

        public IPostService CreatePostService()
        {
            return new PostService(unitofwork);
        }

        public IUserProfileService CreateUserProfileService()
        {
            return new UserProfileService(unitofwork);
        }

    }
}
