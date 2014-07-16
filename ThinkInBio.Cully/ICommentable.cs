using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ThinkInBio.Cully
{

    public interface ICommentable
    {

        long TargetId { get; }

        CommentTarget Target { get; }

    }

}
