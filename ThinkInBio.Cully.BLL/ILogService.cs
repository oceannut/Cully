using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.CommonApp;
using ThinkInBio.Cully;

namespace ThinkInBio.Cully.BLL
{
    public interface ILogService
    {

        void SaveLog(Log log);

        void UpdateLog(Log log);

        Log GetLog(long id);

        IList<Log> GetLogList(DateTime? startTime, DateTime? endTime, 
            int startRowIndex, int maxRowsCount);

        IList<Log> GetLogList(DateTime? startTime, DateTime? endTime, string creator, 
            int startRowIndex, int maxRowsCount);

        IList<Log> GetLogList(DateTime? startTime, DateTime? endTime, string creator, string category,
            int startRowIndex, int maxRowsCount);

        IList<Log> GetLogList(long projectId);

        void SaveComment(Log log, Comment comment, ICollection<BizNotification> notificationList);

        void DeleteComment(Log log, Comment comment, ICollection<BizNotification> notificationList);

    }
}
