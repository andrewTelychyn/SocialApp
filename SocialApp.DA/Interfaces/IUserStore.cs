using System;
using System.Collections.Generic;
using System.Text;
using SocialApp.DA.Entities;
using System.Threading.Tasks;

namespace SocialApp.DA.Interfaces
{
    public interface IStore<T>
    {
        Task CreateAsync(T user);

        void Delete(T user);

        T FindByName(string name);

        void Update(T item, string Id);

    }
}
