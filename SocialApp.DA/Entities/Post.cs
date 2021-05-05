using System;
using System.Collections.Generic;
using System.Text;

namespace SocialApp.DA.Entities
{
    public class Post
    {
        public string Id { get; set; }

        public string Content { get; set; }

        public string UserProfileId { get; set; }

        public virtual UserProfile UserProfile { get; set; }

        public DateTime Date { get; set; } = DateTime.Now;


        public virtual ICollection<UserProfile> Likes { get; set; } = new List<UserProfile>();

        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}
