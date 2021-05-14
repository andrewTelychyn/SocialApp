using System;
using System.Collections.Generic;
using System.Text;

namespace SocialApp.DA.Entities
{
    public class Comment
    {
        public string Id { get; set; }

        public string Content { get; set; }

        public string PostId { get; set; }

        public virtual Post Post { get; set; }

        public string UserProfileId { get; set; }

        public virtual UserProfile UserProfile { get; set; }

        public DateTime Date { get; set; } = DateTime.Now;

        public virtual ICollection<Like> Likes { get; set; } = new List<Like>();

    }
}
