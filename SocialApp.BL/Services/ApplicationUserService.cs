using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using SocialApp.BL.BusinessModels;
using SocialApp.BL.DTO;
using SocialApp.BL.Interfaces;
using SocialApp.DA.Interfaces;
using System.Threading.Tasks;
using SocialApp.DA.Entities;
using Microsoft.AspNetCore.Identity;

namespace SocialApp.BL.Services
{
    public class ApplicationUserService : IApplicationUserService
    {
        private readonly IUnitOfWork database;

        public ApplicationUserService(IUnitOfWork uow)
        {
            database = uow;
        }

        public OperationDetails Authenticate(UserDTO item)
        {
            try
            {
                if (item.Email == "" || item.Email == null || item.Password == "" || item.Password == null)
                    return new OperationDetails(false, "Empty input data");

                ApplicationUser user = database.UserStore.FindByName(item.Email);
                if (user == null)
                    return new OperationDetails(false, "User doesn't exists");


                bool correct = new PasswordHasher().VerifyHash(item.Password, user.PasswordHash);
                if (!correct)
                    return new OperationDetails(false, "Wrong password");

                var token = TokenCreator.Create();

                Console.WriteLine($"Login user: {item.Name}");

                return new OperationDetails(true, "Successfully login", null, new { token, userId = user.Id  });
            }
            catch (Exception e)
            {
                return new OperationDetails(false, e.Message);
            }
        }

        public async Task<OperationDetails> Create(UserDTO item)
        {
            try
            {
                if (item.Name == "" || item.Name == null || item.Email == "" ||
                    item.Email == null || item.Password == "" || item.Password == null)
                    return new OperationDetails(false, "Wrong input data");

                Console.WriteLine($"{item.Email} - {item.Password}");

                ApplicationUser user =  database.UserStore.FindByName(item.Email);
                if (user != null)
                    return new OperationDetails(false, "Already exists", "Email");

                user = new ApplicationUser { Email = item.Email, UserName = item.Email, Id = new IdGenerator().Generate() };

                var hasher = new PasswordHasher();
                user.PasswordHash = hasher.GetHash(item.Password);
                 
                UserProfile profile = new UserProfile
                {
                    Id = user.Id,
                    Bio = item.Bio,
                    Photo = item.Photo,
                    Name = item.Name,
                    ApplicationUser = user
                };

                user.UserProfile = profile;

                user = AddToRoleAsync(user, "User");
                await database.UserStore.CreateAsync(user);

                await database.UserProfiles.CreateAsync(profile);
                database.Commit();
                hasher.Dispose();

                var token = TokenCreator.Create();

                Console.WriteLine($"Created new user: {item.Name}");

                return new OperationDetails(true, "Successfully created", null, new { token, userId = user.Id});
            }
            catch (Exception e)
            {
                return new OperationDetails(false, e.Message);
            }
        }

        public ApplicationUser AddToRoleAsync(ApplicationUser user, string roleName)
        {
            var role =  database.RoleStore.FindByName(roleName);

            if (role != null)
                user.Role = role.Name;

            return user;
        }
    }
}
