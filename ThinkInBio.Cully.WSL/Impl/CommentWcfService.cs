using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.ServiceModel.Web;

using ThinkInBio.Common.Exceptions;
using ThinkInBio.Common.ExceptionHandling;
using ThinkInBio.Cully;
using ThinkInBio.Cully.BLL;

namespace ThinkInBio.Cully.WSL.Impl
{

    public class CommentWcfService : ICommentWcfService
    {

        internal ICommentService CommentService { get; set; }
        internal IExceptionHandler ExceptionHandler { get; set; }

        public Comment UpdateComment(string user, string id, string content)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new WebFaultException<string>("user", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(content))
            {
                throw new WebFaultException<string>("content", HttpStatusCode.BadRequest);
            }
            long idLong = 0;
            try
            {
                idLong = Convert.ToInt64(id);
            }
            catch
            {
                throw new WebFaultException<string>("id", HttpStatusCode.BadRequest);
            }

            try
            {
                Comment comment = CommentService.GetComment(idLong);
                if (comment == null)
                {
                    throw new WebFaultException(HttpStatusCode.NotFound);
                }
                comment.Content = content;
                comment.Update(null,
                    (e1, e2) =>
                    {
                        CommentService.UpdateComment(e1);
                    });
                return comment;
            }
            catch (WebFaultException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {
                ExceptionHandler.HandleException(ex);
                throw new WebFaultException(HttpStatusCode.InternalServerError);
            }
        }

        public Comment[] GetCommentList(string user, string commentTarget, string targetId)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new WebFaultException<string>("user", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(commentTarget))
            {
                throw new WebFaultException<string>("commentTarget", HttpStatusCode.BadRequest);
            }
            CommentTarget target = CommentTarget.Log;
            switch (commentTarget.ToLower())
            {
                case "log":
                    target = CommentTarget.Log;
                    break;
                case "task":
                    target = CommentTarget.Task;
                    break;
                default:
                    throw new WebFaultException<string>("commentTarget", HttpStatusCode.BadRequest);
            }
            long targetIdLong = 0;
            try
            {
                targetIdLong = Convert.ToInt64(targetId);
            }
            catch
            {
                throw new WebFaultException<string>("targetId", HttpStatusCode.BadRequest);
            }

            try
            {
                IList<Comment> list = CommentService.GetCommentList(target, targetIdLong);
                if (list != null)
                {
                    return list.ToArray();
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                ExceptionHandler.HandleException(ex);
                throw new WebFaultException(HttpStatusCode.InternalServerError);
            }

        }

    }

}
