using System;
using System.Collections.Generic;
using System.Text;

namespace SocialApp.BL.Interfaces
{
    public interface IServiceCreator
    {
        ICommentService CreateCommentService();

        IPostService CreatePostService();

        IUserProfileService CreateUserProfileService();

        IApplicationUserService CreateApplicationUserService();

    }

}
