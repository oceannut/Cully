using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.Cully;
using ThinkInBio.Cully.DAL;

namespace ThinkInBio.Cully.BLL.Impl
{

    public class CommentService : ICommentService
    {

        internal ICommentDao CommentDao { get; set; }

        public void UpdateComment(Comment comment)
        {
            if (comment == null)
            {
                throw new ArgumentNullException();
            }

            CommentDao.Update(comment);
        }

        public Comment GetComment(long id)
        {
            if (id == 0)
            {
                throw new ArgumentException();
            }

            return CommentDao.Get(id);
        }

        public IList<Comment> GetCommentList(CommentTarget target, long targetId)
        {
            if (targetId == 0)
            {
                throw new ArgumentException();
            }

            return CommentDao.GetList(target, targetId);
        }

    }

}
