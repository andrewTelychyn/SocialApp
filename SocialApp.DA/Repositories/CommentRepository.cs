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
    public class CommentRepository : IRepository<Comment>
    {
        private ApplicationDbContext context;

        private bool disposed = false;

        public CommentRepository(ApplicationDbContext context)
        {
            this.context = context;
        }


        public async Task CreateAsync(Comment item)
        {
            await context.Comments.AddAsync(item);
        }

        public void Delete(Comment item)
        {
            context.Comments.Remove(item);
        }

        public async Task<Comment> GetItemAsync(string id)
        {
            return await context.Comments.FindAsync(id);
        }

        public IEnumerable<Comment> GetAllAsync()
        {
            return context.Comments;
        }

        public void Update(Comment Item, string Id)
        {
            var local = context.Comments.Local.FirstOrDefault(Item => Item.Id == Id);
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
