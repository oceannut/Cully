using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.Common.Exceptions;
using ThinkInBio.Cully;
using ThinkInBio.Cully.BLL;

namespace ThinkInBio.Cully.WSL.Impl
{

    public class LogWcfService : ILogWcfService
    {

        internal ILogService LogService { get; set; }
        internal ICommentService CommentService { get; set; }

        public Log SaveLog(string user, string date, string content, string tag1, string tag2, string tag3)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            if (string.IsNullOrWhiteSpace(content))
            {
                throw new ArgumentNullException();
            }
            DateTime d = DateTime.Parse(date);
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

        public Log UpdateLog(string user, string id, string date, string content, string tag1, string tag2, string tag3)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException();
            }
            if (string.IsNullOrWhiteSpace(content))
            {
                throw new ArgumentNullException();
            }

            Log log = LogService.GetLog(Convert.ToInt64(id));
            if (log == null)
            {
                throw new ObjectNotFoundException(id);
            }
            DateTime d = DateTime.Parse(date);
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

        public Log[] GetLogList4User(string user, string start, string count)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            int startInt = Convert.ToInt32(start);
            int countInt = Convert.ToInt32(count);
            IList<Log> list = LogService.GetLogList(user, startInt, countInt);
            if (list != null)
            {
                return list.ToArray();
            }
            else
            {
                return null;
            }
        }

        public Log[] GetLogList4User(string user, string date, string span, string start, string count)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            DateTime startTime, endTime;
            DateTime d = DateTime.Parse(date);
            int spanInt = Convert.ToInt32(span);
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
            int startInt = Convert.ToInt32(start);
            int countInt = Convert.ToInt32(count);
            IList<Log> list = LogService.GetLogList(user, startTime, endTime, startInt, countInt);
            if (list != null)
            {
                return list.ToArray();
            }
            else
            {
                return null;
            }
        }

        public Log[] GetLogList(string start, string count)
        {
            int startInt = Convert.ToInt32(start);
            int countInt = Convert.ToInt32(count);
            IList<Log> list = LogService.GetLogList(startInt, countInt);
            if (list != null)
            {
                return list.ToArray();
            }
            else
            {
                return null;
            }
        }

        public Log[] GetLogList(string date, string span, string start, string count)
        {
            DateTime startTime, endTime;
            DateTime d = DateTime.Parse(date);
            int spanInt = Convert.ToInt32(span);
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
            int startInt = Convert.ToInt32(start);
            int countInt = Convert.ToInt32(count);
            IList<Log> list = LogService.GetLogList(startTime, endTime, startInt, countInt);
            if (list != null)
            {
                return list.ToArray();
            }
            else
            {
                return null;
            }
        }

        public Comment SaveComment(string user, string logId, string content)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            if (string.IsNullOrWhiteSpace(logId) || string.IsNullOrWhiteSpace(content))
            {
                throw new ArgumentNullException();
            }

            Log log = LogService.GetLog(Convert.ToInt64(logId));
            if (log == null)
            {
                throw new ObjectNotFoundException(logId);
            }
            return log.Remark(user, content,
                (e1, e2, e3) =>
                {
                    LogService.UpdateLog4Comment(e1, e2, e3);
                });
        }

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
            comment.Update(
                (e) =>
                {
                    CommentService.UpdateComment(comment);
                });
            return comment;
        }

        public Comment[] GetCommentList(string user, string logId)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            if (string.IsNullOrWhiteSpace(logId))
            {
                throw new ArgumentNullException();
            }
            IList<Comment> list = LogService.GetCommentList(Convert.ToInt64(logId));
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
