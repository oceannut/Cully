using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.Cully;
using ThinkInBio.Cully.DAL;

namespace ThinkInBio.Cully.BLL.Impl
{

    public class LogService : ILogService
    {

        internal ILogDao LogDao { get; set; }

        public void SaveLog(Log log)
        {
            if (log == null)
            {
                throw new ArgumentNullException();
            }

            LogDao.Save(log);
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
