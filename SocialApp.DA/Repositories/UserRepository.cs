using SocialApp.DA.EF;
using SocialApp.DA.Entities;
using SocialApp.DA.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SocialApp.DA.Repositories
{
    public class UserRepository : IRepository<UserProfile>
    {
        private ApplicationDbContext context;

        private bool disposed = false;

        public UserRepository(ApplicationDbContext context)
        {
            this.context = context;
        }



        public async Task CreateAsync(UserProfile item)
        {
            await context.UserProfiles.AddAsync(item);
        }

        public void Delete(UserProfile item)
        {
            context.UserProfiles.Remove(item);
        }

        public async Task<UserProfile> GetItemAsync(string id)
        {
            return await context.UserProfiles.FindAsync(id);
        }

        public IEnumerable<UserProfile> GetAll()
        {
            return context.UserProfiles;
        }

        public void Update(UserProfile item)
        {
            context.UserProfiles.Update(item);
        }



        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        public virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    context.Dispose();
                }
            }
            this.disposed = true;
        }

    }
}
