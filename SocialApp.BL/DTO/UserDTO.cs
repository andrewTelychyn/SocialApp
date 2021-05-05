using System;
using System.Collections.Generic;
using System.Text;

namespace SocialApp.BL.DTO
{
    public class UserDTO
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string Bio { get; set; }

        public byte[] Photo { get; set; }


        public string Email { get; set; }

        public string UserName { get; set; }

        public string Password { get; set; }


        public ICollection<string> PostsIds { get; set; }

        public ICollection<string> SubscriptionsUserIds { get; set; }

        public ICollection<string> SubscribersUserIds { get; set; }

    }
}
