using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SocialApp.DA.Interfaces
{
    public interface IRepository<T> : IDisposable where T : class
    {
        Task CreateAsync(T item);

        void Update(T Item, string Id);

        void Delete(T item);

        Task<T> GetItemAsync(string Id);

        IEnumerable<T> GetAllAsync();
    }
}
