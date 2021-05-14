using SocialApp.DA.EF;
using SocialApp.DA.Entities;
using SocialApp.DA.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;


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

        public IEnumerable<Comment> GetAll()
        {
            return context.Comments;
        }

        public void Update(Comment item)
        {
            context.Entry(item).State = Microsoft.EntityFrameworkCore.EntityState.Detached;
            context.Comments.Update(item);
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
