using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using SocialApp.BL.Interfaces;
using SocialApp.DA.Repositories;


namespace SocialApp.BL.Services
{
    public class ServiceCreator : IServiceCreator
    {
        private readonly string connecting;

        public ServiceCreator(string connectingString)
        {
            connecting = connectingString;
        }


        public IApplicationUserService CreateApplicationUserService()
        {
            return new ApplicationUserService(new UnitOfWork(connecting));
        }

        public ICommentService CreateCommentService()
        {
            return new CommentService(new UnitOfWork(connecting));
        }

        public IPostService CreatePostService()
        {
            return new PostService(new UnitOfWork(connecting));
        }

        public IUserProfileService CreateUserProfileService()
        {
            return new UserProfileService(new UnitOfWork(connecting));
        }

    }
}
