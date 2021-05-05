using System;
using System.Collections.Generic;
using System.Text;

namespace SocialApp.BL.DTO
{
    public class CommentDTO
    {
        public string Id { get; set; }

        public string Content { get; set; }

        public string UserId { get; set; }

        public string PostId { get; set; }

        public DateTime Date { get; set; }


        public ICollection<string> LikesUserIds { get; set; }
    }
}
