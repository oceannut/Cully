using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.Cully;

namespace ThinkInBio.Cully.BLL
{
    public interface ILogService
    {

        void SaveLog(Log log);

        IList<Log> GetLogList(int startRowIndex, int maxRowsCount);

        IList<Log> GetLogList(DateTime startTime, DateTime endTime, 
            int startRowIndex, int maxRowsCount);

        IList<Log> GetLogList(string user,
            int startRowIndex, int maxRowsCount);

        IList<Log> GetLogList(string user, 
            DateTime startTime, DateTime endTime, 
            int startRowIndex, int maxRowsCount);

    }
}
