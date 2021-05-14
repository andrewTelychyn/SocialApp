using Microsoft.AspNetCore.Identity;
using SocialApp.DA.EF;
using SocialApp.DA.Entities;
using SocialApp.DA.Interfaces;
using System.Threading.Tasks;
using SocialApp.DA.Repositories;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;


namespace SocialApp.DA.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private CommentRepository _commentRepository;

        private PostRepository _postRepository;

        private UserRepository _userRepository;

        private LikeRepository _likeRepository;

        private readonly ApplicationDbContext _applicationDbContext;

        private RoleStore _roleStore;

        private UserStore _userStore;


        public UnitOfWork(ApplicationDbContext context)
        {
            _applicationDbContext = context;
            SeedData().GetAwaiter();
        }

        public IRepository<Like> Likes
        {
            get
            {
                return _likeRepository ??= new LikeRepository(_applicationDbContext);
            }
        }

        public IDetachRepository<UserProfile> UserProfiles
        {
            get
            {
                return _userRepository ??= new UserRepository(_applicationDbContext);
            }
        }

        public IRepository<Comment> Comments
        {
            get
            {
                return _commentRepository ??= new CommentRepository(_applicationDbContext);
            }
        }

        public IRepository<Post> Posts
        {
            get
            {
                return _postRepository ??= new PostRepository(_applicationDbContext);
            }
        }

        public IStore<ApplicationRole> RoleStore
        {
            get
            {
                return _roleStore ??= new RoleStore(_applicationDbContext);
            }
        }

        public IStore<ApplicationUser> UserStore
        {
            get
            {
                return _userStore ??= new UserStore(_applicationDbContext);
            }
        }

        public void Commit()
        {
            _applicationDbContext.SaveChanges();
        }

        private async Task SeedData()
        {

            _applicationDbContext.Database.Migrate();
            System.Console.WriteLine("Migrating...");

            if (!(await _applicationDbContext.Roles.AnyAsync()))
            {
                List<string> RoleNames = new List<string> { "Admin", "User" };

                foreach (var roleName in RoleNames)
                {
                    var role = RoleStore.FindByName(roleName);

                    if (role == null)
                        await RoleStore.CreateAsync(new ApplicationRole { Name = roleName });
                }
                Commit();
            }

            if (!(await _applicationDbContext.ApplicationUsers.AnyAsync()))
            {

                var adminBody = new ApplicationUser() { Email = "Admin@test.com", EmailConfirmed = true, UserName = "Admin@test.com"};

                var role = await _applicationDbContext.Roles.FindAsync("Admin");

                if (role != null)
                {
                    adminBody.Role = "Admin";
                }

                var user = new UserProfile { Name = "Admin"};
                adminBody.UserProfile = user;
                user.ApplicationUser = adminBody;

                _applicationDbContext.UserProfiles.Add(user);
                _applicationDbContext.ApplicationUsers.Add(adminBody);

                Commit();
            }
        }
    }
}
