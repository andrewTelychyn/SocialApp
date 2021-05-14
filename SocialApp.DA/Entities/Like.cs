using System;
using System.Collections.Generic;
using System.Text;

namespace SocialApp.DA.Entities
{
    public class Like
    {
        public string Id { get; set; }

        public string UserProfileId { get; set; }

        public virtual UserProfile UserProfile {get; set;}

        public DateTime Date { get; set; } = DateTime.Now;
    }
}
