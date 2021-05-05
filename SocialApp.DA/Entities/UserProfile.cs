using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;


namespace SocialApp.DA.Entities
{
    public class UserProfile
    {
        [Key]
        [ForeignKey("ApplicationUser")]
        public string Id { get; set; }

        public string Name { get; set; }

        public string Bio { get; set; }

        public byte[] Photo { get; set; }


        public virtual ICollection<Post> Posts { get; set; } = new List<Post>();

        public virtual ICollection<UserProfile> Subscriptions { get; set; } = new List<UserProfile>();

        public virtual ICollection<UserProfile> Subscribers { get; set; } = new List<UserProfile>();


        public virtual ApplicationUser ApplicationUser { get; set; }
    }
}
