using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SocialApp.DA.Interfaces
{
    public interface IDetachRepository<T> : IRepository<T> where T : class
    { 
        void DetachLocal(T Item, string Id);
    }
}
