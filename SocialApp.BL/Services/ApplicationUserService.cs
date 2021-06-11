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

                System.Console.WriteLine(user.Email);
                System.Console.WriteLine(user.Role);

                if(user.Role == "" || user.Role == null)
                {
                    user.Role = "User";
                    database.UserStore.Update(user, user.Id);
                    database.Commit().GetAwaiter();
                }

                var claims = new List<Claim> 
                {
                    new Claim(ClaimsIdentity.DefaultNameClaimType, user.Email),
                    new Claim(ClaimsIdentity.DefaultRoleClaimType, user.Role),
                };

                var token = TokenCreator.Create(claims);

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

                var hasher = new PasswordHasher();
                user = new ApplicationUser { 
                    Email = item.Email, 
                    UserName = item.Email, 
                    Id = new IdGenerator().Generate(), 
                    Role = "User", 
                    NormalizedEmail = item.Email.ToUpper(), 
                    PasswordHash = hasher.GetHash(item.Password) };



                UserProfile profile = new UserProfile
                {
                    Id = user.Id,
                    Bio = item.Bio,
                    Photo = Convert.FromBase64String(item.Photo),
                    Name = item.Name,
                    ApplicationUser = user
                };


                user.UserProfile = profile;
                await database.UserStore.CreateAsync(user);

                await database.UserProfiles.CreateAsync(profile);
                await database.Commit();
                hasher.Dispose();

                ApplicationUser user2 =  database.UserStore.FindByName(item.Email);
                if (user2 == null)
                    System.Console.WriteLine("Failed");

                var claims = new List<Claim> 
                {
                    new Claim(ClaimsIdentity.DefaultNameClaimType, user.Email),
                    new Claim(ClaimsIdentity.DefaultRoleClaimType, user.Role),
                };

                var token = TokenCreator.Create(claims);

                Console.WriteLine($"Created new user: {item.Name}");

                return new OperationDetails(true, "Successfully created", null, new { token, userId = user.Id});
            }
            catch (Exception e)
            {
                return new OperationDetails(false, e.Message);
            }
        }
    }
}
