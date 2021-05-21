using SocialApp.DA.EF;
using SocialApp.DA.Entities;
using SocialApp.DA.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace SocialApp.DA.Repositories
{
    public class LikeRepository : IRepository<Like>
    {
        private ApplicationDbContext context;

        private bool disposed = false;

        public LikeRepository(ApplicationDbContext context)
        {
            this.context = context;
        }


        public async Task CreateAsync(Like item)
        {
            await context.Likes.AddAsync(item);
        }

        public void Delete(Like item)
        {
            context.Likes.Remove(item);
        }

        public async Task<Like> GetItemAsync(string id)
        {
            return await context.Likes.FindAsync(id);
        }

        public IEnumerable<Like> GetAllAsync()
        {
            return context.Likes.ToList();
        }

        public void Update(Like Item, string Id)
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
