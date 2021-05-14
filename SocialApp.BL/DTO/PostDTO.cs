using System;
using System.Collections.Generic;
using System.Text;

namespace SocialApp.BL.DTO
{
    public class PostDTO
    {
        public string Id { get; set; }

        public string Content { get; set; }

        public string UserId { get; set; }

        public string UserName { get; set; } 

        public DateTime Date { get; set; }

        public ICollection<string> LikesUserIds { get; set; }

        public ICollection<string> CommentsIds { get; set; }
    }
}
