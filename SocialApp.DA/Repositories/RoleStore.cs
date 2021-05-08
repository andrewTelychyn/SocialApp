using System;
using System.Collections.Generic;
using System.Text;
using SocialApp.DA.Interfaces;
using SocialApp.DA.Entities;
using SocialApp.DA.EF;
using System.Threading.Tasks;

namespace SocialApp.DA.Repositories
{
    public class RoleStore : IStore<ApplicationRole>
    {
        ApplicationDbContext context;


        public RoleStore(ApplicationDbContext db)
        {
            context = db;
        }

        public async Task CreateAsync(ApplicationRole user)
        {
            await context.Roles.AddAsync(user);
        }

        public void Delete(ApplicationRole user)
        {
            context.Roles.Remove(user);
        }

        public ApplicationRole FindByName(string name)
        {
            return context.Roles.Find(name);
        }

        public void Update(ApplicationRole item)
        {
            context.Roles.Update(item);
        }
    }
}
