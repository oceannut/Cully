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

        public Log GetLog(long id)
        {
            if (id == 0)
            {
                throw new ArgumentException();
            }
            return LogDao.Get(id);
        }

        public IList<Log> GetLogList(DateTime startTime, DateTime endTime, int startRowIndex, int maxRowsCount)
        {
            return GetLogList(startTime, endTime, null, null, startRowIndex, maxRowsCount);
        }

        public IList<Log> GetLogList(DateTime startTime, DateTime endTime, string creator, int startRowIndex, int maxRowsCount)
        {
            return GetLogList(startTime, endTime, creator, null, startRowIndex, maxRowsCount);
        }

        public IList<Log> GetLogList(DateTime startTime, DateTime endTime, string creator, string category, int startRowIndex, int maxRowsCount)
        {
            if (startTime >= endTime)
            {
                throw new ArgumentException();
            }
            if (startRowIndex < 0)
            {
                throw new ArgumentOutOfRangeException();
            }

            return LogDao.GetList(startTime, endTime, creator, category, null, startRowIndex, maxRowsCount);
        }

        public IList<Log> GetLogList(int year, int month, long? projectId)
        {
            if (year < 1970)
            {
                throw new ArgumentOutOfRangeException();
            }
            if (month < 0 || month > 12)
            {
                throw new ArgumentOutOfRangeException();
            }
            DateTime startTime, endTime;
            if (month > 0)
            {
                startTime = new DateTime(year, month, 1);
                endTime = startTime.AddMonths(1);
            }
            else
            {
                startTime = new DateTime(year, 1, 1);
                endTime = startTime.AddYears(1);
            }
            return LogDao.GetList(startTime, endTime, null, null, projectId, 0, int.MaxValue);
        }

        public void SaveComment(Log log, Comment comment, ICollection<BizNotification> notificationList)
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

        public void DeleteComment(Log log, Comment comment, ICollection<BizNotification> notificationList)
        {
            if (log == null || comment == null)
            {
                throw new ArgumentNullException();
            }

            LogDao.Update4CommentCount(log.Id, log.CommentCount);
            CommentDao.Delete(comment);
            if (notificationList != null && notificationList.Count > 0)
            {
                BizNotificationService.SaveNotification(notificationList);
            }
        }

    }

}
