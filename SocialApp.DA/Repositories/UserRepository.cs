using SocialApp.DA.EF;
using SocialApp.DA.Entities;
using SocialApp.DA.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;

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

        public IEnumerable<UserProfile> GetAllAsync()
        {
            return context.UserProfiles.ToList();
        }

        public void Update(UserProfile Item, string Id)
        {
            var local = context.UserProfiles.Local.FirstOrDefault(Item => Item.Id == Id);
            if(local != null)
            {
                context.Entry(local).State = EntityState.Detached;
            }
            context.Entry(Item).State = EntityState.Modified;
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
