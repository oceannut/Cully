using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.Common.Data;
using ThinkInBio.Cully;

namespace ThinkInBio.Cully.DAL
{
    public interface IAttachmentDao : IDao<Attachment>
    {

        bool Update4CommentCount(long id, int count);

        IList<Attachment> GetList(long projectId);

    }
}
