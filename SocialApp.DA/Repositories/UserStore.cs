using System;
using System.Collections.Generic;
using System.Text;
using SocialApp.DA.Interfaces;
using SocialApp.DA.Entities;
using System.Threading.Tasks;
using SocialApp.DA.EF;
using System.Linq;
using Microsoft.EntityFrameworkCore;


namespace SocialApp.DA.Repositories
{
    public class UserStore : IStore<ApplicationUser>
    {
        ApplicationDbContext context;

        public UserStore(ApplicationDbContext db)
        {
            context = db;
        }

        public async Task CreateAsync(ApplicationUser user)
        {
            await context.ApplicationUsers.AddAsync(user);
        }

        public void Delete(ApplicationUser user)
        {
            context.ApplicationUsers.Remove(user);
        }

        public ApplicationUser FindByName(string name)
        {
            return context.ApplicationUsers.FirstOrDefault(u => u.Email == name);
            //return await context.ApplicationUsers.FindAsync(name);
        }

        public void Update(ApplicationUser item, string Id)
        {
            var local = context.ApplicationUsers.Local.ToList().FirstOrDefault(item => item.Id == Id);
            if(local != null)
            {
                context.Entry(local).State = EntityState.Detached;
            }
            context.Entry(item).State = EntityState.Modified;
        }
    }
}
