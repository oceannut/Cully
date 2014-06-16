using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.Cully;

namespace ThinkInBio.Cully.BLL
{

    public interface ICommentService
    {

        void UpdateComment(Comment comment);

        Comment GetComment(long id);

    }

}
