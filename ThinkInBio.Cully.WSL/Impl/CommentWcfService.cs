using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.Common.Exceptions;
using ThinkInBio.Cully;
using ThinkInBio.Cully.BLL;

namespace ThinkInBio.Cully.WSL.Impl
{

    public class CommentWcfService : ICommentWcfService
    {

        internal ICommentService CommentService { get; set; }

        public Comment UpdateComment(string user, string id, string content)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            if (string.IsNullOrWhiteSpace(id) || string.IsNullOrWhiteSpace(content))
            {
                throw new ArgumentNullException();
            }

            Comment comment = CommentService.GetComment(Convert.ToInt64(id));
            if (comment == null)
            {
                throw new ObjectNotFoundException(id);
            }
            comment.Content = content;
            comment.Update(null,
                (e1, e2) =>
                {
                    CommentService.UpdateComment(e1);
                });
            return comment;
        }

        public Comment[] GetCommentList(string user, string commentTarget, string targetId)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            if (string.IsNullOrWhiteSpace(commentTarget) || string.IsNullOrWhiteSpace(targetId))
            {
                throw new ArgumentNullException();
            }
            CommentTarget target = CommentTarget.Log;
            switch (commentTarget.ToLower())
            {
                case"log":
                    target = CommentTarget.Log;
                    break;
                case"task":
                    target = CommentTarget.Task;
                    break;
                default:
                    break;
            }
            IList<Comment> list = CommentService.GetCommentList(target, Convert.ToInt64(targetId));
            if (list != null)
            {
                return list.ToArray();
            }
            else
            {
                return null;
            }
        }

    }

}
