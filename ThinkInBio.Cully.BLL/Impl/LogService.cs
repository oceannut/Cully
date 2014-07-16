using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.CommonApp;
using ThinkInBio.CommonApp.BLL;
using ThinkInBio.Cully;
using ThinkInBio.Cully.DAL;

namespace ThinkInBio.Cully.BLL.Impl
{

    public class LogService : ILogService
    {

        internal ILogDao LogDao { get; set; }
        internal ICommentDao CommentDao { get; set; }
        internal IBizNotificationService BizNotificationService { get; set; }

        public void SaveLog(Log log)
        {
            if (log == null)
            {
                throw new ArgumentNullException();
            }

            LogDao.Save(log);
        }

        public void UpdateLog(Log log)
        {
            if (log == null)
            {
                throw new ArgumentNullException();
            }

            LogDao.Update(log);
        }

        public void UpdateLog4Comment(Log log, Comment comment, ICollection<BizNotification> notificationList)
        {
            if (log == null || comment == null)
            {
                throw new ArgumentNullException();
            }

            LogDao.Update4CommentCount(log.Id, log.CommentCount);
            CommentDao.Save(comment);
            if (notificationList != null && notificationList.Count > 0)
            {
                BizNotificationService.SaveNotification(notificationList);
            }
        }

        public Log GetLog(long id)
        {
            if (id == 0)
            {
                throw new ArgumentException();
            }
            return LogDao.Get(id);
        }

        public IList<Log> GetLogList(int startRowIndex, int maxRowsCount)
        {
            if (startRowIndex < 0)
            {
                throw new ArgumentOutOfRangeException();
            }
            return LogDao.GetList(null, null, null, startRowIndex, maxRowsCount);
        }

        public IList<Log> GetLogList(DateTime startTime, DateTime endTime, int startRowIndex, int maxRowsCount)
        {
            if (startTime >= endTime)
            {
                throw new ArgumentException();
            }
            if (startRowIndex < 0)
            {
                throw new ArgumentOutOfRangeException();
            }

            return LogDao.GetList(null, startTime, endTime, startRowIndex, maxRowsCount);
        }

        public IList<Log> GetLogList(string user, int startRowIndex, int maxRowsCount)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException();
            }
            if (startRowIndex < 0)
            {
                throw new ArgumentOutOfRangeException();
            }

            return LogDao.GetList(user, null, null, startRowIndex, maxRowsCount);
        }

        public IList<Log> GetLogList(string user, DateTime startTime, DateTime endTime, int startRowIndex, int maxRowsCount)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException();
            }
            if (startTime >= endTime)
            {
                throw new ArgumentException();
            }
            if (startRowIndex < 0)
            {
                throw new ArgumentOutOfRangeException();
            }

            return LogDao.GetList(user, startTime, endTime, startRowIndex, maxRowsCount);
        }

    }

}
