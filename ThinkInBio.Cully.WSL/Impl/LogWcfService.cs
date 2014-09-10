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

    public class LogWcfService : ILogWcfService
    {

        internal ILogService LogService { get; set; }
        internal ICommentService CommentService { get; set; }
        internal IExceptionHandler ExceptionHandler { get; set; }

        public Log SaveLog(string user, string date, string title, string content, string category, string tag1, string tag2, string tag3)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new WebFaultException<string>("user", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(title))
            {
                throw new WebFaultException<string>("title", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(content))
            {
                throw new WebFaultException<string>("content", HttpStatusCode.BadRequest);
            }
            DateTime d = DateTime.MinValue;
            try
            {
                d = DateTime.Parse(date);
            }
            catch
            {
                throw new WebFaultException<string>("date", HttpStatusCode.BadRequest);
            }

            try
            {
                List<string> tags = new List<string>();
                if (!string.IsNullOrWhiteSpace(tag1))
                {
                    tags.Add(tag1);
                }
                if (!string.IsNullOrWhiteSpace(tag2))
                {
                    tags.Add(tag2);
                }
                if (!string.IsNullOrWhiteSpace(tag3))
                {
                    tags.Add(tag3);
                }

                Log log = new Log(d, content, user);
                log.Title = title;
                log.Category = category;
                if (tags.Count > 0)
                {
                    log.AddTag(tags);
                }
                log.Save(
                    (e) =>
                    {
                        LogService.SaveLog(e);
                    });
                return log;
            }
            catch (Exception ex)
            {
                ExceptionHandler.HandleException(ex);
                throw new WebFaultException(HttpStatusCode.InternalServerError);
            }
        }

        public Log UpdateLog(string user, string id, string date, string title, string content, string category, string tag1, string tag2, string tag3)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new WebFaultException<string>("user", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(title))
            {
                throw new WebFaultException<string>("title", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(content))
            {
                throw new WebFaultException<string>("content", HttpStatusCode.BadRequest);
            }
            DateTime d = DateTime.MinValue;
            try
            {
                d = DateTime.Parse(date);
            }
            catch
            {
                throw new WebFaultException<string>("date", HttpStatusCode.BadRequest);
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
                Log log = LogService.GetLog(idLong);
                if (log == null)
                {
                    throw new WebFaultException(HttpStatusCode.NotFound);
                }
                List<string> tags = new List<string>();
                if (!string.IsNullOrWhiteSpace(tag1))
                {
                    tags.Add(tag1);
                }
                if (!string.IsNullOrWhiteSpace(tag2))
                {
                    tags.Add(tag2);
                }
                if (!string.IsNullOrWhiteSpace(tag3))
                {
                    tags.Add(tag3);
                }
                log.Title = title;
                log.Category = category;
                log.Content = content;
                log.StartTime = d;
                log.AddTag(tags);
                log.Update(
                    (e) =>
                    {
                        LogService.UpdateLog(e);
                    });
                return log;
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

        public Log[] GetLogList(string user, string date, string span, string creator, string category, string start, string count)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new WebFaultException<string>("user", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(creator))
            {
                throw new WebFaultException<string>("creator", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(category))
            {
                throw new WebFaultException<string>("category", HttpStatusCode.BadRequest);
            }
            DateTime d = DateTime.MinValue;
            int spanInt = 0;
            if ("null" != date && "null" != span)
            {
                try
                {
                    d = DateTime.Parse(date);
                }
                catch
                {
                    throw new WebFaultException<string>("date", HttpStatusCode.BadRequest);
                }
                try
                {
                    spanInt = Convert.ToInt32(span);
                }
                catch
                {
                    throw new WebFaultException<string>("span", HttpStatusCode.BadRequest);
                }
            }

            int startInt = 0;
            try
            {
                startInt = Convert.ToInt32(start);
            }
            catch
            {
                throw new WebFaultException<string>("start", HttpStatusCode.BadRequest);
            }
            int countInt = 0;
            try
            {
                countInt = Convert.ToInt32(count);
            }
            catch
            {
                throw new WebFaultException<string>("count", HttpStatusCode.BadRequest);
            }

            DateTime startTime, endTime;
            if (spanInt < 0)
            {
                startTime = d.AddDays(spanInt + 1);
                endTime = new DateTime(d.Year, d.Month, d.Day, 23, 59, 59);
            }
            else
            {
                startTime = new DateTime(d.Year, d.Month, d.Day);
                endTime = d.AddDays(spanInt).AddSeconds(-1);
            }
            string creatorInput = "null" == creator ? null : creator;
            string categoryInput = "null" == category ? null : category;

            try
            {
                IList<Log> list = LogService.GetLogList(startTime, endTime, creatorInput, categoryInput, startInt, countInt);
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

        public Comment SaveComment(string user, string logId, string content)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new WebFaultException<string>("user", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(content))
            {
                throw new WebFaultException<string>("content", HttpStatusCode.BadRequest);
            }
            long logIdLong = 0;
            try
            {
                logIdLong = Convert.ToInt64(logId);
            }
            catch
            {
                throw new WebFaultException<string>("logId", HttpStatusCode.BadRequest);
            }

            try
            {
                Log log = LogService.GetLog(logIdLong);
                if (log == null)
                {
                    throw new WebFaultException(HttpStatusCode.NotFound);
                }
                return log.AddRemark(user, content,
                    (e1, e2, e3) =>
                    {
                        LogService.SaveComment(e1, e2, e3);
                    });
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

        public void DeleteComment(string user, string logId, string commentId)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new WebFaultException<string>("user", HttpStatusCode.BadRequest);
            }
            long logIdLong = 0;
            try
            {
                logIdLong = Convert.ToInt64(logId);
            }
            catch
            {
                throw new WebFaultException<string>("logId", HttpStatusCode.BadRequest);
            }
            long commentIdLong = 0;
            try
            {
                commentIdLong = Convert.ToInt64(commentId);
            }
            catch
            {
                throw new WebFaultException<string>("commentId", HttpStatusCode.BadRequest);
            }

            try
            {
                Log log = LogService.GetLog(logIdLong);
                if (log == null)
                {
                    throw new WebFaultException(HttpStatusCode.NotFound);
                }
                Comment comment = CommentService.GetComment(commentIdLong);
                if (comment == null)
                {
                    throw new WebFaultException(HttpStatusCode.NotFound);
                }
                log.RemoveRemark(comment,
                    (e1, e2, e3) =>
                    {
                        LogService.DeleteComment(e1, e2, e3);
                    });
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

    }

}
