using SocialApp.DA.EF;
using SocialApp.DA.Entities;
using SocialApp.DA.Interfaces;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace SocialApp.DA.Repositories
{
    public class PostRepository : IRepository<Post>
    {
        private ApplicationDbContext context;

        private bool disposed = false;

        public PostRepository(ApplicationDbContext context)
        {
            this.context = context;
        }


        public async Task CreateAsync(Post item)
        {
            await context.Posts.AddAsync(item);
        }

        public void Delete(Post item)
        {
            context.Posts.Remove(item);
        }

        public async Task<Post> GetItemAsync(string id)
        {
            return await context.Posts.FindAsync(id);
        }

        public IEnumerable<Post> GetAllAsync()
        {
            return context.Posts;
        }

        public void Update(Post Item, string Id)
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
