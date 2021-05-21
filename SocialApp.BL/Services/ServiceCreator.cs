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
    public class ServiceCreator //: IServiceCreator
    {
        private readonly string connectingString;

        public ServiceCreator(string connectingString)
        {
            this.connectingString = connectingString;
        }


        public ApplicationUserService CreateApplicationUserService()
        {
            return new ApplicationUserService(new UnitOfWork(new ApplicationDbContext(connectingString)));
        }

        public CommentService CreateCommentService()
        {
            return new CommentService(new UnitOfWork(new ApplicationDbContext(connectingString)));
        }

        public PostService CreatePostService()
        {
            return new PostService(new UnitOfWork(new ApplicationDbContext(connectingString)));
        }

        public UserProfileService CreateUserProfileService()
        {
            return new UserProfileService(new UnitOfWork(new ApplicationDbContext(connectingString)));
        }

    }
}
